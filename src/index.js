import app from "./app";

const main = () => {
    app.listen(app.get("port"));
    console.log(`Server on port ${app.get("port")}`);
    //console.log("listen on " + process.env.PORT);
};

main();
