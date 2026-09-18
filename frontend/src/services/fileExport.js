/**
 * JSON 및 메모장(TXT) 파일 다운로드 / 업로드 유틸리티
 */

// JSON 다운로드
export function exportToJSON(data, filename = 'honeymoon_plan.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 메모장(TXT) 형식으로 변환하여 다운로드
export function exportToTXT(data, filename = 'honeymoon_itinerary.txt') {
  let content = '==================================================\n';
  content += `✈️ ${data.headerPass?.title || '이베리아 신혼여행 여정'}\n`;
  content += '==================================================\n\n';

  if (data.headerPass) {
    content += `[ 항공 및 이동 요약 ]\n`;
    content += `• ${data.headerPass.inCity}: ${data.headerPass.inDate} (${data.headerPass.inFlight})\n`;
    content += `• ${data.headerPass.outCity}: ${data.headerPass.outDate} (${data.headerPass.outFlight})\n`;
    content += `• 여행 기간: ${data.headerPass.periodVal} (${data.headerPass.periodSub})\n`;
    content += `• 주요 동선: ${data.headerPass.routeVal} (${data.headerPass.routeSub})\n\n`;
  }

  content += `--------------------------------------------------\n`;
  content += `[ 도시별 상세 여정 ]\n`;
  content += `--------------------------------------------------\n\n`;

  if (data.cities) {
    Object.values(data.cities).forEach((city) => {
      content += `■ ${city.title} (${city.dates})\n`;
      content += `  "${city.tagline}"\n\n`;

      if (city.days && city.days.length > 0) {
        city.days.forEach((day) => {
          content += `  ▶ ${day.date} - ${day.title} ${day.tag ? `[${day.tag}]` : ''}\n`;
          if (day.items && day.items.length > 0) {
            day.items.forEach((item) => {
              // HTML 태그 제거
              const cleanItem = item.replace(/<[^>]+>/g, '');
              content += `    - ${cleanItem}\n`;
            });
          }
          content += '\n';
        });
      }

      if (city.hotels && city.hotels.length > 0) {
        content += `  [추천 숙소]\n`;
        city.hotels.forEach((hotel) => {
          content += `  • ${hotel.name}: ${hotel.note}\n`;
        });
        content += '\n';
      }

      if (city.nextRoute) {
        content += `  [다음 구간 이동]: ${city.nextRoute}\n\n`;
      }
      content += '--------------------------------------------------\n\n';
    });
  }

  if (data.budget && data.budget.items) {
    content += `--------------------------------------------------\n`;
    content += `[ ${data.budget.title || '예상 경비'} ]\n`;
    content += `--------------------------------------------------\n`;
    data.budget.items.forEach((item) => {
      content += `• ${item.category} (${item.desc}) : ${item.amount}\n`;
    });
    content += `▶ 총계: ${data.budget.totalText}\n`;
    content += `※ ${data.budget.note}\n\n`;
  }

  if (data.checklist) {
    content += `--------------------------------------------------\n`;
    content += `[ 가이드 추천 체크리스트 & 준비물 ]\n`;
    content += `--------------------------------------------------\n`;
    data.checklist.forEach((cat) => {
      content += `■ ${cat.category}\n`;
      cat.items.forEach((item) => {
        content += `  [${item.checked ? 'V' : ' '}] ${item.text}\n`;
      });
      content += '\n';
    });
  }

  if (data.notices && data.notices.length > 0) {
    content += `--------------------------------------------------\n`;
    content += `[ 여행 꿀팁 및 주의사항 ]\n`;
    content += `--------------------------------------------------\n`;
    data.notices.forEach((n) => {
      content += `• [${n.tag}] ${n.text}\n`;
    });
    content += '\n';
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// JSON 파일 읽기 유틸
export function importFromJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        resolve(parsed);
      } catch (err) {
        reject(new Error('유효한 JSON 파일이 아닙니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsText(file);
  });
}
