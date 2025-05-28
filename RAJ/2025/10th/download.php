<?php
require 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;
use Dompdf\Options;

if (!isset($_GET['roll_no'], $_GET['wb_id'], $_GET['year'])) {
    die("Error: Missing parameters.");
}

$rollNo = $_GET['roll_no'];
$wbId = $_GET['wb_id'];
$year = $_GET['year'];

// API कॉल करें
$apiUrl = "https://manish-bhaiyas-bot.onrender.com/result?roll_no=$rollNo&wb_id=$wbId&year=$year";
$response = file_get_contents($apiUrl);
if ($response === false) {
    die("Error fetching data.");
}
$data = json_decode($response, true);
if (!isset($data['data']['board_result'])) {
    die("Invalid data received.");
}

$res = $data['data']['board_result'];
$info = $res['candidate_info'];
$result = $res['result'];
$subjects = array_filter($res['subjects'], fn($s) => $s['subject_name'] && $s['subject_marks']);

// HTML कंटेंट बनाएँ
$html = '
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; }
        th { background-color: #f2f2f2; text-align: center; }
        .section-header { background-color: #d0e4f5; font-weight: bold; text-align: center; font-size: 18px; }
        .left { text-align: left; }
        .center { text-align: center; }
    </style>
</head>
<body>
    <h2>Student Result</h2>
    <table>
        <tr><th colspan="6" class="section-header">Student Details</th></tr>
        <tr>
            <td colspan="2" class="left"><strong>Name:</strong> '.$info["Candidate Name"].'</td>
            <td colspan="4" class="left"><strong>Roll No:</strong> '.$info["Roll No."].'</td>
        </tr>
        <tr><td colspan="6" class="left"><strong>Father\'s Name:</strong> '.$info["Father Name"].'</td></tr>
        <tr><td colspan="6" class="left"><strong>Mother\'s Name:</strong> '.$info["Mother Name"].'</td></tr>
        <tr><td colspan="6" class="left"><strong>School:</strong> '.$info["School Name"].'</td></tr>

        <tr><th colspan="6" class="section-header">Marks Details</th></tr>
        <tr>
            <th>Subject</th><th>TH</th><th>SS</th><th>TH+SS</th><th>PR</th><th>Total</th>
        </tr>';

foreach ($subjects as $sub) {
    $html .= '
        <tr>
            <td class="left">'.$sub['subject_name'].'</td>
            <td class="center">'.($sub['theory_1'] ?? '-').'</td>
            <td class="center">'.($sub['seassional'] ?? '-').'</td>
            <td class="center">'.($sub['theory_seasional'] ?? '-').'</td>
            <td class="center">'.($sub['practical'] ?? '-').'</td>
            <td class="center">'.$sub['subject_marks'].'</td>
        </tr>';
}

$html .= '
        <tr>
            <td colspan="6" class="left">
                <strong>Total Marks:</strong> '.trim($result["Total Marks"]).'<br>
                <strong>Percentage:</strong> '.trim($result["percent"]).'%<br>
                <strong>Result:</strong> '.$result["Result"].'
            </td>
        </tr>
    </table>
</body>
</html>';

// PDF बनाएं
$options = new Options();
$options->set('isHtml5ParserEnabled', true);
$dompdf = new Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

$title = preg_replace('/[^A-Za-z0-9_\-]/', '_', $info["Candidate Name"] ?? "Result");
$dompdf->stream("{$title}.pdf", ["Attachment" => 1]);
