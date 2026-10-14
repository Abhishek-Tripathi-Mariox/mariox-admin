function include(file) {
  var script = document.createElement("script");
  script.src = file;
  script.type = "text/javascript";
  script.defer = true;

  document.getElementsByTagName("body").item(0).appendChild(script);
}

/* Include Many js files */
// include('assets/js/chart.js/Chart.min.js');
// include('assets/js/dashboardChart.js');
// include('assets/js/jquery.min.js');
// include('assets/js/popper.min.js');
// include("assets/plugins/bootstrap/js/bootstrap.js");
// include("assets/plugins/bootstrap/js/bootstrap.min.js");
