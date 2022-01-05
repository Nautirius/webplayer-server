var http = require("http");
var fs = require("fs");
var formidable = require("formidable");
var Datastore = require('nedb')

var playlist = new Datastore({
    filename: 'static/playlists/playlist.db',
    autoload: true
});

var server = http.createServer(function (req, res) {
    console.log(req.method);
    console.log(req.url)
    switch (req.method) {
        case "GET":
            if (req.url == "/") {
                fs.readFile(`static/index.html`, function (error, data) {
                    if (error) {
                        console.log(error);
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        res.writeHead(200, { 'Content-Type': `text/html` });
                        res.write(data);
                        res.end();
                    }
                });
            }
            else if (req.url == "/admin") {
                fs.readFile(`static/admin.html`, function (error, data) {
                    if (error) {
                        console.log(error);
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        res.writeHead(200, { 'Content-Type': `text/html` });
                        res.write(data);
                        res.end();
                    }
                });
            }
            else if (req.url.indexOf("cover") != -1) {
                fs.readFile(__dirname + "/static/mp3/" + decodeURI(req.url), function (err, data) {
                    if (err) {
                        console.log(err);
                        res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        res.writeHead(200, { "Content-type": "image/jpeg" });
                        res.write(data);
                        res.end();
                    }
                })
            }
            else if (req.url.indexOf(".mp3") != -1) {
                fs.readFile(__dirname + "/static/mp3/" + decodeURI(req.url), function (error, data) {
                    var stats = fs.statSync(__dirname + "/static/mp3/" + decodeURI(req.url));
                    res.writeHead(200, {
                        "Content-type": "audio/mpeg", "Content-Type": "audio/mpeg",
                        "Content-Length": stats.size,
                        "Accept-Ranges": "bytes"
                    });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf("gfx") != -1) {
                fs.readFile(__dirname + "/static/" + decodeURI(req.url), function (err, data) {
                    if (err) {
                        console.log(err);
                        res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        res.writeHead(200, { "Content-type": "image/jpeg" });
                        res.write(data);
                        res.end();
                    }
                })
            }
            else if (req.url.includes("getPlaylist")) {
                let songs = [];
                playlist.loadDatabase();
                playlist.find({}, function (err, docs) {
                    docs.forEach(doc => {
                        songs.push({ id: doc._id, file: doc.file, size: doc.size, album: doc.album })
                    });
                    res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                    res.end(JSON.stringify({ dirs: [], files: songs }));
                });
                console.log(JSON.stringify({ dirs: [], files: songs }, null, 4))
            }
        case "POST":
            if (req.url == "/startitems") {
                var dir_list = [];
                var items_list = [];
                fs.readdir(__dirname + "/static/mp3", function (err, files) {
                    if (err) {
                        console.log(error);
                        res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        files.forEach(function (file) {
                            var stats = fs.statSync(__dirname + "/static/mp3/" + file);
                            console.log(stats.size)
                            console.log(stats.isFile())
                            console.log(file);
                            dir_list.push({ file: file })
                        });
                        fs.readdir(__dirname + "/static/mp3/" + dir_list[0].file, function (err, files) {
                            if (err) {
                                console.log(err);
                                res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                                res.write("<h1>404 - brak takiej strony</h1>");
                                res.end();
                            } else {
                                files.forEach(function (file) {
                                    if (!file.includes("coverFBK")) {
                                        var stats = fs.statSync(__dirname + "/static/mp3/" + dir_list[0].file + "/" + file);
                                        console.log(stats.size)
                                        console.log(stats.isFile())
                                        console.log(file);
                                        items_list.push({ file: file, size: String(stats.size * 0.000001), album: dir_list[0].file })
                                    }
                                });
                                console.log(JSON.stringify({ dirs: dir_list, files: items_list }, null, 4))
                                res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                                res.end(JSON.stringify({ dirs: dir_list, files: items_list }, null, 4));
                            }
                        });
                    }
                });
            }
            else if (req.url == "/cover") {
                fs.readdir(__dirname + "/static/mp3", function (err, files) {
                    if (err) {
                        console.log(err);
                        res.setHeader('404', { 'Content-Type': 'text/html' }, { "Access-Control-Allow-Origin": "http://localhost:8080" });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        var cover_list = [];
                        let contr = 0;
                        let contr2 = files.length;
                        files.forEach(function (file) {
                            var stats = fs.statSync(__dirname + "/static/mp3/" + file);
                            console.log(stats.size)
                            console.log(stats.isFile())
                            var coverImage;
                            fs.readdir(__dirname + "/static/mp3/" + file, function (err, files) {
                                if (err) {
                                    console.log(err);
                                    res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                                    res.write("<h1>404 - brak takiej strony</h1>");
                                    res.end();
                                } else {
                                    for (let i = 0; i < files.length; i++) {
                                        if (files[i].includes("coverFBK")) {
                                            coverImage = files[i];
                                            console.log(coverImage)
                                            cover_list.push({ file: file, image: coverImage })
                                            break;
                                        }
                                    }
                                    contr++;
                                }
                                if (contr == contr2) {
                                    console.log(JSON.stringify(cover_list, null, 4))
                                    res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                                    res.end(JSON.stringify(cover_list, null, 4));
                                }
                            });
                        })
                    }
                });
            }
            else if (req.url.includes("items/")) {
                var dir_list = [];
                var items_list = [];
                console.log(req.url.split("/"))
                fs.readdir(__dirname + "/static/mp3", function (err, files) {
                    if (err) {
                        console.log(error);
                        res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                        res.write("<h1>404 - brak takiej strony</h1>");
                        res.end();
                    } else {
                        files.forEach(function (file) {
                            var stats = fs.statSync(__dirname + "/static/mp3/" + file);
                            console.log(stats.size)
                            console.log(stats.isFile())
                            console.log(file);
                            dir_list.push({ file: file })
                        });
                        fs.readdir(__dirname + "/static/mp3/" + decodeURIComponent(req.url).split("/")[2], function (err, files) {
                            if (err) {
                                console.log(err);
                                res.writeHead(404, { 'content-type': 'text/html', "access-control-allow-origin": "http://localhost:8080" });
                                res.write("<h1>404 - brak takiej strony</h1>");
                                res.end();
                            } else {
                                files.forEach(function (file) {
                                    if (!file.includes("coverFBK")) {
                                        var stats = fs.statSync(__dirname + "/static/mp3/" + decodeURIComponent(req.url).split("/")[2] + "/" + file);
                                        console.log(stats.size)
                                        console.log(stats.isFile())
                                        console.log(file);
                                        items_list.push({ file: file, size: String(stats.size * 0.000001), album: decodeURIComponent(req.url).split("/")[2] })
                                    }
                                });
                                console.log(JSON.stringify({ dirs: dir_list, files: items_list }, null, 4))
                                res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                                res.end(JSON.stringify({ dirs: dir_list, files: items_list }, null, 4));
                            }
                        });
                    }
                });
            }
            else if (req.url.includes("playlist/addItem/")) {
                let recievedSong = JSON.parse(decodeURIComponent(req.url.replace("/playlist/addItem/", "")));
                var doc = recievedSong;
                playlist.insert(doc, function (err, newDoc) {
                    console.log(err)
                    console.log("dodano dokument (obiekt):")
                    console.log(newDoc)
                    console.log("losowe id dokumentu: " + newDoc._id)
                });
                res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                res.end();
            }
            else if (req.url.includes("playlist/removeItem/")) {
                let recievedSong = decodeURIComponent(req.url.replace("/playlist/removeItem/", ""));
                playlist.remove({ _id: recievedSong }, {}, function (err, numRemoved) {
                    console.log(err)
                    console.log("usunięto dokumentów: ", numRemoved)
                });
                res.writeHead(200, { 'content-type': 'application/json', "access-control-allow-origin": "http://localhost:8080" });
                res.end();
            }
            else if (req.url == ("/fileupload")) {
                var dir;
                do {
                    dir = __dirname + '/static/mp3/' + String(Math.round(Math.random() * 1000000));
                } while (fs.existsSync(dir))

                fs.mkdirSync(dir);

                let form = formidable({})

                form.keepExtensions = true;
                form.multiples = true
                form.uploadDir = dir // katalog na zuploadowane pliki

                form.parse(req, function (err, fields, files) {
                    console.log(files);

                    if (!files.cover) {
                        fs.copyFileSync(`${__dirname}/static/gfx/defaultCover.png`, `${dir}/coverFBK.png`)
                    } else {
                        fs.rename(files.cover.path, `${dir}/coverFBK.jpg`, function (err) {
                            if (err) console.log(err)
                            console.log("rename ok")
                        });
                    }
                    if (files.mp3) {
                        console.log(files.mp3.length)
                        if (files.mp3.length != undefined) {
                            files.mp3.forEach(song => {
                                fs.rename(song.path, `${dir}/${song.name}`, function (err) {
                                    if (err) console.log(err)
                                    console.log("rename ok")
                                });
                            });
                        } else {
                            fs.rename(files.mp3.path, `${dir}/${files.mp3.name}`, function (err) {
                                if (err) console.log(err)
                                console.log("rename ok")
                            });
                        }
                    }
                    res.writeHead(200, { 'content-type': 'application/json' });
                    res.end(JSON.stringify(files));
                });
            }
    }
});

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});