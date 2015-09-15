<?php session_start(); ?>

<!DOCTYPE html>
<html lang='en'>
    <head>
        <title></title>
    </head>
    <body>
        <h1>Web Components Example: Hierarchical Forms</h1>
        <h2>Last Submission</h2>
        <pre><?php echo $_SESSION['web_components_submission'] ?></pre>
        <p><a href='..'>Submit another form</a></p>
    </body>
</html>