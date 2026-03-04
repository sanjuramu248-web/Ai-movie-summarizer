"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const db_1 = require("./db");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
(0, db_1.getPgVersion)()
    .then(() => {
    app_1.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.log("failed to run server", err);
});
//# sourceMappingURL=index.js.map