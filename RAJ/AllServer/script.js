const wbId = 89;
var labelColSpan = 3;
var valueColSpan = 4;
var totalColSpan = 7;
var isTheory2ExistVar = false;

$(function () {
  var rollnumber = $.urlParam('rollnumber');
  if (rollnumber) {
    getResult(rollnumber);
  } else {
    alert("Roll number is required in URL. Example: ?rollnumber=1234567");
  }
});

$.urlParam = function (name) {
  var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results ? decodeURIComponent(results[1]) : null;
};

function getResult(rollnumber) {
  $.ajax({
    method: "GET",
    url: "https://www.fastresult.in/board-results/rajresultapi12/api/get-12th-result",
    data: {
      tag: 'raj_12th_result',
      roll_no: rollnumber,
      year: 2025,
      wb_id: wbId,
      source: 1
    },
    dataType: 'json'
  })
  .done(function (data) {
    if (data.status === "success") {
      const candidateInfo = data.data.board_result.candidate_info;
      const subjects = data.data.board_result.subjects;
      const result = data.data.board_result.result;

      createMarksheetPart('PERSONAL DETAILS', candidateInfo, 'personalDetailsTable');
      isTheory2Exist(subjects);
      setUserMarksAndResult(subjects, result);
      setDisclaimersTable();
    } else {
      alert("Error: " + data.data.err_msg);
    }
  })
  .fail(function () {
    alert("Failed to load result.");
  });
}

function createTableHead(title) {
  return '<thead><tr><th colspan="' + totalColSpan + '" class="text-center">' + title + '</th></tr></thead>';
}

function createMarksheetPart(title, obj, elementId) {
  const header = createTableHead(title);
  let body = "<tbody>";
  for (let key in obj) {
    body += '<tr><td colspan="' + labelColSpan + '"><strong>' + key + '</strong></td><td colspan="' + valueColSpan + '">' + obj[key] + '</td></tr>';
  }
  body += "</tbody>";
  $('#' + elementId).html(header + body);
}

function isTheory2Exist(subjects) {
  isTheory2ExistVar = subjects.some(sub => sub.theory_2 && !isNaN(sub.theory_2));
}

function setUserMarksAndResult(subjects, result) {
  let header = createTableHead('MARKS DETAILS');
  let rows = "<tbody>";

  rows += isTheory2ExistVar ?
    '<tr class="text-uppercase"><td>SUBJECT</td><td>Theory 1</td><td>Theory 2</td><td>Sessional</td><td>Th+SS</td><td>Practical</td><td>Total</td></tr>' :
    '<tr class="text-uppercase"><td>SUBJECT</td><td>Theory</td><td>Sessional</td><td>Th+SS</td><td>Practical</td><td>Total</td></tr>';

  subjects.forEach(sub => {
    if (sub.subject_name.trim()) {
      rows += '<tr><td><strong>' + sub.subject_name + '</strong></td>';
      if (isTheory2ExistVar) {
        rows += `<td>${sub.theory_1}</td><td>${sub.theory_2}</td><td>${sub.seassional}</td><td>${sub.theory_seasional}</td><td>${sub.practical}</td><td>${sub.subject_marks}</td>`;
      } else {
        rows += `<td>${sub.theory_1}</td><td>${sub.seassional}</td><td>${sub.theory_seasional}</td><td>${sub.practical}</td><td>${sub.subject_marks}</td>`;
      }
      rows += '</tr>';
    }
  });

  rows += `<tr><td colspan="${labelColSpan}"><strong>Total Marks</strong></td><td colspan="${valueColSpan}">${result['Total Marks']}</td></tr>`;
  rows += `<tr><td colspan="${totalColSpan}" class="text-center"><strong>Percentage: ${result['percent']}%</strong></td></tr>`;
  rows += `<tr><td colspan="${totalColSpan}" class="text-center"><strong>Result: ${result['Result']}</strong></td></tr>`;
  rows += "</tbody>";

  $('#marksheetTable').html(header + rows);
}

function setDisclaimersTable() {
  const header = createTableHead("DISCLAIMERS");
  let info = '<tr><td colspan="' + totalColSpan + '">1. This result has been provisionally announced.</td></tr>';
  info += '<tr><td colspan="' + totalColSpan + '">2. This is a Computer Generated Provisional Score Card.</td></tr>';
  $('#disclaimersTable').html(header + info);
}
