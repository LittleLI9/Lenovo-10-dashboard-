const PROXY_CONFIG = 
{
    // "/log/export_to_local_file": {
    //     "target": "http://10.100.46.104:9002/",
    //     "secure": false,
    //     "bypass": function (req, res, proxyOptions) {
    //         console.log(5,res,req.query);
    //        if(req.path=='/log/export_to_local_file'){
    //             res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    //             res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
    //             res.end();
    //         }
    //         // if (req.headers.accept.indexOf("html") !== -1) {
    //         //     console.log("Skipping proxy for browser request.");
    //         //     return "/index.html";
    //         // }
    //         // req.headers["X-Custom-Header"] = "yes";
    //     }
    // },
    
    "/log/search?*": {
        proxy:{
            '/api':{
                // "target": "http://10.100.46.94:9002/",
                "target":'http://10.121.9.118:8901',
                "secure": false,
                "bypass": function (req, res, proxyOptions) {
                    console.log(req.path,req.query);
                    // if(req.path=='/log/search'){
                    //     res.writeHead(200, { 'Content-Type': 'text/plain' });
                    //     // res.writeHead(200, { 'Content-Type': 'application/json' });
                    //     res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
                    //     res.end();
                    // }
                }
            },
            
        }
        
    },

    "/api/getDataList": {
        "target": "http://10.100.46.104:9002/",
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            console.log(req.method);
          //   if(req.path=='/api/getDataList'&&req.method=='GET'){
          //       const metrics= {
          //           "code":200,
          //           "result":[
          //               {
          //                   "id":"xx",
          //                   "filename":"xxxx",
          //                   "realm":"smart_vest",
          //                   "user_id":"xx",
          //                   "device_id":"xx",
          //                   "data_type":"xx",
          //                   "begin_time":123123123,
          //                   "end_time": 123123123,
          //                   "state":"saved",  //saving，saved，error,
          //                   "storage_type":"s3", //s3,disk
          //                   "path":"/data/xxx"
          //               },
          //               {
          //                   //...
          //               }
          //           ],
          //           "message":"success"
          //       };
          // //      res.writeHead(200, { 'Content-Type': 'text/plain' });
          //       res.write(JSON.stringify(metrics, true, 2));
          //       res.end();
          //   }
            // if (req.headers.accept.indexOf("html") !== -1) {
            //     console.log("Skipping proxy for browser request.");
            //     return "/index.html";
            // }
            // req.headers["X-Custom-Header"] = "yes";
        }
    },
}

module.exports = PROXY_CONFIG;
