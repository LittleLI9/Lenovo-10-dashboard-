const PROXY_CONFIG = [
    // {"/log/export_to_local_file": {
    //     "target": "http://10.100.46.104:9002/",
    //     "secure": false,
    //     "bypass": function (req, res, proxyOptions) {
    //         console.log(22,req.headers,req.query);
    //        if(req.path=='/log/export_to_local_file'){
    //             res.writeHead(200, { 'Content-Type': 'application/json' });
    //             res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    //             // res.end();
    //         }
    //     //     // if (req.headers.accept.indexOf("html") !== -1) {
    //     //     //     console.log("Skipping proxy for browser request.");
    //     //     //     return "/index.html";
    //     //     // }
    //     //     // req.headers["X-Custom-Header"] = "yes";
    //      }
    //  }
    // },

{
                context: [
                    "/*",
                    "/*/*",
                    "/*/*/*",
                    "/*/*?*",
                    "/*/*/*/*"
                ],
                // target: "http://10.100.206.94:9002",
                // target:"http://10.100.47.10:8080",
                target:'http://10.121.9.118:8901',
                secure: false
            }
]
module.exports = PROXY_CONFIG
