<?php

session_start();

$_SESSION['web_components_submission'] = file_get_contents('php://input');