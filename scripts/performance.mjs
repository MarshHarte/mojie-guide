// Historical performance reports are displayed only in the README.
export function renderPerformance(data) {
  const markdown = [
    data.note,
    data.speedUnitNote,
    ...data.reports.map(report => `### ${report.title}\n\n图示测试时间：${report.testedAt}；测试环境：${report.environment}。\n\n[![魔戒机场${report.title}完整历史测试图表](${report.image})](${report.image})\n\n${report.analysis}`)
  ].join('\n\n');
  return {markdown};
}
