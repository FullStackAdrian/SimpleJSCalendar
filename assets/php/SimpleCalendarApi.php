<?php

// ¡ READ BEFORE START CONFIGURATION !
// Remember that the backend and frontend infrastructure can be on the same server or on different servers,
// It depends on the needs and architecture of the project.
// If you are going to upgrade the project so that you can handle events from the frontend via forms, you should still consider separating the api from the frontend server. 
// You can find this api and more apis for make CRUD, to manage your calendar in FullStackAdrian/SimplePHPCalendarApis !! 

header('Content-Type: application/json');

// Database configuration
$host = 'localhost'; // Change this for your MySQL server if it is not on localhost
$db = 'bbddname';
$user = 'mysqluser'; // Change this to your MySQL user
$pass = 'mysqlpassword'; // Change this to your MySQL password

// Connect to MySQL database
$mysqli = new mysqli($host, $user, $pass, $db);

// Verify the connection
if ($mysqli->connect_error) {
    die(json_encode(["error" => $mysqli->connect_error]));
}

// Consultation to obtain the events
$sql = "SELECT id, title, start, end, allDay, location, description FROM events";
$result = $mysqli->query($sql);

$events = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $events[] = [
            "id" => $row["id"],
            "title" => $row["title"],
            "start" => $row["start"],
            "end" => $row["end"],
            "allDay" => $row["allDay"],
            "location" => $row["location"],
            "description" => $row["description"]
        ];
    }
}

$json = json_encode(["events" => $events], JSON_PRETTY_PRINT);
// Devolver los eventos como JSON
echo $json;

// Cerrar la conexión
$mysqli->close();
?>
