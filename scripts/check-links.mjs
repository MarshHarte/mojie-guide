import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = JSON.parse(await fs.readFile(path.join(root, 'brand.json'), 'utf8'));
const plain = text => text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&(?:nbsp|lt|gt);/g, ' ').replace(/\s+/g, ' ').trim();

function publicUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || /^(?:\d+\.){3}\d+$/.test(url.hostname) || /(?:^|\.)(?:localhost|local|internal)$/.test(url.hostname)) {
    throw new Error('仅检查公开 HTTPS 域名，不跟随本地地址或 HTTP 降级');
  }
  return url;
}

async function inspectRoute(route) {
  const checkedAt = new Date().toISOString();
  const result = {id: route.id, url: route.url, checkedAt, finalUrl: null, httpStatus: null, title: '', titleMentionsBrand: false, outcome: 'unverified', recommendationState: route.recommendable ? 'manually_reviewed' : 'held', redirects: []};
  try {
    let next = publicUrl(route.url);
    const signal = AbortSignal.timeout(15000);
    let response;
    for (let step = 0; step <= 4; step++) {
      response = await fetch(next, {redirect: 'manual', signal, headers: {'User-Agent': 'MojieGuideLinkCheck/1.0', Accept: 'text/html'}});
      result.httpStatus = response.status;
      result.finalUrl = response.url;
      if (![301,302,303,307,308].includes(response.status)) break;
      const location = response.headers.get('location');
      if (!location || step === 4) { await response.body?.cancel(); throw new Error('重定向缺少目标或超过 4 次'); }
      result.redirects.push({from: response.url, status: response.status, to: new URL(location, next).href});
      await response.body?.cancel();
      next = publicUrl(new URL(location, next).href);
    }
    if (!response.ok) {
      await response.body?.cancel();
      result.outcome = 'http_error';
      result.note = 'HTTP 错误，不能据此判断服务整体状态';
      return result;
    }
    if (!/text\/html|application\/xhtml\+xml/i.test(response.headers.get('content-type') || '')) {
      await response.body?.cancel();
      throw new Error('响应不是可核对标题的 HTML 页面');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = '', size = 0;
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512 * 1024) { await reader.cancel(); throw new Error('页面超过 512 KiB，请人工核对'); }
      html += decoder.decode(value, {stream: true});
    }
    html += decoder.decode();
    result.title = plain(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
    result.titleMentionsBrand = /魔戒|mojie/i.test(result.title);
    result.outcome = result.titleMentionsBrand ? 'page_observed' : 'review_needed';
    result.note = result.titleMentionsBrand ? '当次网页返回成功且标题含品牌名，未测试登录、套餐或代理节点' : '当次返回页面，标题与品牌关联需要人工复核';
  } catch (error) {
    result.note = error.name === 'TimeoutError' ? '本次请求超时，状态未确认' : error.message;
  }
  return result;
}

// 顺序请求只检查配置中的入口，不登录、不访问注册或付款操作。
const results = [];
for (const route of brand.routes) results.push(await inspectRoute(route));
const report = {brand: brand.name, generatedAt: new Date().toISOString(), scope: '单一网络环境的公开页面检查，不代表持续可用率或代理节点速度', results};
await fs.mkdir(path.join(root, 'reports'), {recursive: true});
await fs.writeFile(path.join(root, 'reports', 'link-check.json'), JSON.stringify(report, null, 2) + '\n');
for (const result of results) console.log(`${result.id} ${result.url} | ${result.httpStatus ?? '—'} | ${result.outcome} | ${result.finalUrl ?? '—'} | ${result.title || result.note}`);
console.log('报告已保存 reports/link-check.json。自动检查不点击注册按钮，不更改人工开放状态、入口核对日期或公开页面。');
if (results.some(result => result.outcome !== 'page_observed')) process.exitCode = 1;
