<?php 
require_once('../private/initialize.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set("xdebug.var_display_max_children", '-1');
ini_set("xdebug.var_display_max_data", '-1');
ini_set("xdebug.var_display_max_depth", '-1');

date_default_timezone_set('America/Chicago');
if (date_default_timezone_get()) {
    //echo 'date_default_timezone_set: ' . date_default_timezone_get() . '<br />';
}
if (ini_get('date.timezone')) {
    //echo 'date.timezone: ' . ini_get('date.timezone');
}

$now =  date('Y-m-d H:i');
$time   = strtotime($now);
$current_date =  date('m-d-Y');
$current_date_time_format =  date('m-d-Y H:i');
$current_date_time   = date("Y-m-d H:i", $time);
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Operation Forecast</title>
        <meta name="Description" content="U.S. Army Corps of Engineers St. Louis District Home Page" />
        <link rel="stylesheet" href="../../css/body.css" />
        <link rel="stylesheet" href="stylesheets/style.css" />
        <link rel="stylesheet" href="../../css/breadcrumbs.css" />
        <link rel="stylesheet" href="../../css/jumpMenu.css" />
        <script type="text/javascript" src="../../js/main.js"></script>

        <!-- Add sidebar.css IF NOT LOAD SIDEBAR TEMPLATE -->
        <link rel="stylesheet" href="../../css/sidebar.css"/>

        <!-- Include Moment.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
        <!-- Include the Chart.js library -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <!-- Include the Moment.js adapter for Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@1.0.0"></script>

        <style>
            /* Button Styles */
            #sendEmailBtn {
            background-color: #4CAF50; /* blue */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            margin-top: 20px;
            transition-duration: 0.4s;
            cursor: pointer;
            border-radius: 8px;
            }

            #sendEmailBtn:hover {
            background-color: #45a049; /* Darker Green */
            }
        </style>
    </head>
    <body>
        <div id="page-container">
            <header id="header">
                <!--Header content populated here by JavaScript Tag at end of body -->
            </header>
            <div class="page-wrap">
                <div class="container-fluid">
                    <div id="breadcrumbs">
                    </div>
                    <!--////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                    <!--APP STARTS-->
                    <div class="page-content">
						<div id="topPane" class="col-md backend-cp-collapsible">
							<div class="box-usace">
								<h2 class="box-header-striped">
									<span class="titleLabel title">7-Day Operational River Forecast PHP</span>
									<span class="rss"></span>
								</h2>
								<div class="box-content" style="background-color:white;margin:auto">
									<div class="content">
										<!-- Box Content Here -->
										<span>Forecast Date: Tuesday, 04 June 2024</span> 
                                        <span><h3><a href='forecast.php'>Switch to PHP</a></h3></span> 
                                        <span><h3><a href='forecast.html?cda=internal'>Switch to Cloud Internal</a></h3></span>
                                        <span><h3><a href='forecast.html?cda=public'>Switch to Cloud Public</a></h3></span>
                                        <!-- <div class="alert">
                                            <strong>June 04, 2024 - Version V1.0</strong> - This report was build using PHP, CWMS and JavaScript, no coldfusion schema was used<br>
                                        </div> -->
                                        <div>
                                            Note - This operational forecast is intended for internal use. The official river forecasting agency of the 
                                            Federal Government is the NWS. The NWS forecast for these locations can be found by clicking the blue hyperlink 
                                            associated with each gage location. If there are any questions, please call the water control office at 1-(800)432-1208 
                                            or (314)331-8342.
                                        </div>
									</div>
								</div>
							</div>
						</div>
					</div>
                    <div id="loading_forecast" style="display: none;"><img src="../../images/loading4.gif" style='height: 50px; width: 50px;' alt="Loading..." /></div>
                    <div id="table_container_forecast"></div>
                    <script src="forecast.js"></script>	
                    <!-- <div>
                        OR: Open River conditions and gates are free of the water surfce at the L&D. <br>
                        Bold & Red:
                    </div> -->

                    <div style="display: flex; justify-content: center; align-items: center; width: 100%; background-color: darkgray; margin-top: 50px">
                        <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png" alt="7-day Observed" style="width: 50%; padding-right: 10px;">
                        <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281" alt="7-day QPF" style="width: 50%; padding-left: 10px; border: 1px solid black;">
                    </div>

                    <button id="sendEmailBtn">Send Internal River Forecast Email</button>
                    <script>
                        document.getElementById("sendEmailBtn").addEventListener("click", function() {
                            sendEmail();
                        });

                        function sendEmail() {
                            // Get table HTML
                            const tableHTML = document.getElementById("table_container_forecast").innerHTML;
                            // Send table HTML to PHP script using AJAX
                            const xhr = new XMLHttpRequest();
                            xhr.open("POST", "send_email.php", true);
                            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        // AJAX request completed successfully
                                        console.log(xhr.responseText); // Log response from PHP script
                                        // Display popup alert
                                        alert('Email sent successfully');
                                    } else {
                                        // AJAX request failed
                                        console.error('Error:', xhr.statusText);
                                    }
                                }
                            };
                            xhr.send("tableHTML=" + encodeURIComponent(tableHTML));
                        }

                    </script>

                    <!-- <div style="text-align: center;">
                        <h3>7-day Observed Tue 05/28 06:00 to Tue 06/04 06:00</h3>
                        <img src="https://mrcc.purdue.edu/files/cliwatch/GIS_plots/prcp_mpe/prcp_mpe_007_tot-0.png">
                        <h3>7-day QPF: Tue 06/04 06:00 to Tue 06/11 06:00</h3>
                        <img src="https://www.wpc.ncep.noaa.gov/qpf/p168i.gif?1512662281">
                    </div> -->
                    <br><br><br><br>
                    <!--APP ENDS-->
                    <!--////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                    <div class="page-content">
                        <sidebar id="sidebar">
                        <!--Side bar content populated here by JavaScript Tag at end of body -->
                        </sidebar>
                        <div id="topPane" class="col-md backend-cp-collapsible">
                            <!--////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                            <!-- Page Content Here -->
                            <div class="box-usace">
                                <h2 class="box-header-striped">
                                    <span class="titleLabel title">Note</span>
                                    <span class="rss"></span>
                                </h2>
                                <div class="box-content" style="background-color:white;margin:auto">
                                    <div class="content">
                                        <!-- Box Content Here -->
                                        <p>After midnight, you will see no data and a message "Daily forecasts are updated around noon.".</p>
                                        <p>Data will load after you run the netmiss forecast.</p>
                                    </div>
                                </div>
                            </div>
                            <!--////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
                        </div>
                    </div>
                </div>
                <button id="returnTop" title="Return to Top of Page">Top</button>
            </div>
        </div>
        <footer id="footer">
            <!--Footer content populated here by script tag at end of body -->
        </footer>
        <script src="../../js/libraries/jQuery-3.3.6.min.js"></script>
        <script defer>
            // When the document has loaded pull in the page header and footer skins
            $(document).ready(function () {
                // Change the v= to a different number to force clearing the cached version on the client browser
                $('#header').load('../../templates/DISTRICT.header.html');
                //$('#sidebar').load('../../templates/DISTRICT.sidebar.html');
                $('#footer').load('../../templates/DISTRICT.footer.html');
            })
        </script>
    </body>
</html>
<?php db_disconnect($db); ?>