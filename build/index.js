/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst express_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! express */ \"express\"));\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst express_rate_limit_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! express-rate-limit */ \"express-rate-limit\"));\r\nconst helmet_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! helmet */ \"helmet\"));\r\nconst morgan_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! morgan */ \"morgan\"));\r\nconst path_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! path */ \"path\"));\r\nconst config_1 = __webpack_require__(/*! @core/config */ \"./src/core/config/index.ts\");\r\nconst PassportManager_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! @core/auth/PassportManager */ \"./src/core/auth/PassportManager.ts\"));\r\nconst middlewares_1 = __webpack_require__(/*! @core/middlewares */ \"./src/core/middlewares/index.ts\");\r\nclass App {\r\n    /**\r\n     * Initialize the RESTFul API\r\n     * @param routes List of express routers to\r\n     */\r\n    constructor(routes, prefix) {\r\n        this.app = (0, express_1.default)();\r\n        this.envConfig = new config_1.EnvConfig();\r\n        this.mongoConfig = new config_1.MongoConfig();\r\n        this.prefix = prefix;\r\n        this.passportManager = new PassportManager_1.default(this.app);\r\n        this.envConfig.validate();\r\n        this.app.enable(\"trust proxy\");\r\n        this.connectToDatabase();\r\n        this.initMiddlewares();\r\n        this.passportManager.init();\r\n        this.initRoutes(routes);\r\n        this.initDefaultHandler();\r\n    }\r\n    /**\r\n     * Getter properties\r\n     */\r\n    get port() {\r\n        return this.envConfig.port;\r\n    }\r\n    connectToDatabase() {\r\n        mongoose_1.connection.on(\"error\", console.error.bind(console, \"connection error:\"));\r\n        mongoose_1.connection.once(\"open\", () => {\r\n            console.log(`Mongoose connected to ${this.mongoConfig.uriDisplayName}`);\r\n        });\r\n        (0, mongoose_1.connect)(this.mongoConfig.uri, this.mongoConfig.options);\r\n    }\r\n    initDefaultHandler() {\r\n        this.app.use((req, res) => {\r\n            res.status(404).json({\r\n                statusCode: 404,\r\n                message: `Cannot find ${req.path}`,\r\n            });\r\n        });\r\n    }\r\n    initMiddlewares() {\r\n        if (this.envConfig.isDevelopment) {\r\n            this.app.use((0, morgan_1.default)(\"dev\"));\r\n        }\r\n        else if (this.envConfig.isProduction) {\r\n            this.app.use((0, helmet_1.default)());\r\n            const limiter = (0, express_rate_limit_1.default)({\r\n                windowMs: 600000,\r\n                max: 1800,\r\n                message: \"Too many requests made to the server. Try again later!\",\r\n            });\r\n            this.app.use(limiter);\r\n        }\r\n        // Middleware for all envs\r\n        this.app.use(middlewares_1.CorsMiddleware);\r\n        this.app.use(express_1.default.static(\"public\"));\r\n        this.app.use(express_1.default.json());\r\n        this.app.use(express_1.default.urlencoded({ extended: true }));\r\n    }\r\n    initRoutes(routes) {\r\n        routes.forEach((route) => {\r\n            // If prefix exists for routes, extend with it\r\n            if (!!this.prefix)\r\n                route.path = path_1.default.join(this.prefix, route.path).split(\"\\\\\").join(\"/\");\r\n            // Init router with auth required\r\n            if (route.authRequired)\r\n                this.app.use(route.path, middlewares_1.AuthMiddleware, route.router);\r\n            // Init public router\r\n            else\r\n                this.app.use(route.path, route.router);\r\n        });\r\n    }\r\n    listen() {\r\n        this.app.listen(this.port, () => {\r\n            console.log(`App listening on the port ${this.port}`);\r\n        });\r\n    }\r\n}\r\nexports[\"default\"] = App;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/App.ts?");

/***/ }),

/***/ "./src/core/auth/PassportManager.ts":
/*!******************************************!*\
  !*** ./src/core/auth/PassportManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst passport_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! passport */ \"passport\"));\r\nconst jsonwebtoken_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\r\nconst config_1 = __webpack_require__(/*! @core/config */ \"./src/core/config/index.ts\");\r\nconst strategies_1 = __webpack_require__(/*! ./strategies */ \"./src/core/auth/strategies/index.ts\");\r\nclass PassportManager {\r\n    constructor(app) {\r\n        this.app = app;\r\n        this.passportConfig = new config_1.PassportConfig();\r\n    }\r\n    init() {\r\n        this.app.use(passport_1.default.initialize());\r\n        passport_1.default.use((0, strategies_1.LocalStrategy)(this.passportConfig.localStrategyOptions));\r\n        passport_1.default.serializeUser(this.serializeUser.bind(this));\r\n        passport_1.default.deserializeUser(this.deserializeUser.bind(this));\r\n    }\r\n    serializeUser(user, done) {\r\n        // Payload: Payload => Token: ISerializedUser\r\n        const userToken = {\r\n            token: jsonwebtoken_1.default.sign(user, this.passportConfig.secret, {\r\n                expiresIn: this.passportConfig.expiresIn,\r\n            }),\r\n        };\r\n        done(null, userToken);\r\n    }\r\n    deserializeUser(user, done) {\r\n        // Token: ISerializedUser => Payload:Payload\r\n        done(null, jsonwebtoken_1.default.decode(user.token));\r\n    }\r\n}\r\nexports[\"default\"] = PassportManager;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/auth/PassportManager.ts?");

/***/ }),

/***/ "./src/core/auth/strategies/LocalStrategy.ts":
/*!***************************************************!*\
  !*** ./src/core/auth/strategies/LocalStrategy.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst passport_jwt_1 = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\r\nconst _database_1 = __webpack_require__(/*! @database */ \"./src/database/index.ts\");\r\nfunction LocalStrategy(options) {\r\n    return new passport_jwt_1.Strategy(options, (req, jwtPayload, done) => {\r\n        _database_1.UserModel.findById(jwtPayload.id)\r\n            .then((user) => {\r\n            if (user) {\r\n                req.user = jwtPayload;\r\n                return done(null, jwtPayload);\r\n            }\r\n            return done(null, false);\r\n        })\r\n            .catch(() => done(null, false));\r\n    });\r\n}\r\nexports[\"default\"] = LocalStrategy;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/auth/strategies/LocalStrategy.ts?");

/***/ }),

/***/ "./src/core/auth/strategies/index.ts":
/*!*******************************************!*\
  !*** ./src/core/auth/strategies/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.LocalStrategy = void 0;\r\nvar LocalStrategy_1 = __webpack_require__(/*! ./LocalStrategy */ \"./src/core/auth/strategies/LocalStrategy.ts\");\r\nObject.defineProperty(exports, \"LocalStrategy\", ({ enumerable: true, get: function () { return __importDefault(LocalStrategy_1).default; } }));\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/auth/strategies/index.ts?");

/***/ }),

/***/ "./src/core/config/BaseConfig.ts":
/*!***************************************!*\
  !*** ./src/core/config/BaseConfig.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.BaseConfig = void 0;\r\nconst envalid_1 = __webpack_require__(/*! envalid */ \"envalid\");\r\nclass BaseConfig {\r\n    validate() {\r\n        (0, envalid_1.cleanEnv)(process.env, {\r\n            PORT: (0, envalid_1.port)(),\r\n            NODE_ENV: (0, envalid_1.str)(),\r\n            JWT_SECRET: (0, envalid_1.str)(),\r\n            MONGO_URI_DEV: (0, envalid_1.str)(),\r\n            MONGO_URI_PROD: (0, envalid_1.str)(),\r\n        });\r\n    }\r\n    getString(key) {\r\n        const configValue = process.env[key];\r\n        if (!configValue) {\r\n            throw new Error(`Missing required env ${key}`);\r\n        }\r\n        return configValue;\r\n    }\r\n    getStringOrDefault(key) {\r\n        return process.env[key];\r\n    }\r\n    getInt(key) {\r\n        return parseInt(this.getString(key), 10);\r\n    }\r\n    getIntOrDefault(key) {\r\n        const configValue = process.env[key];\r\n        return configValue ? parseInt(configValue, 10) : undefined;\r\n    }\r\n    getBoolean(key) {\r\n        return this.getString(key) === \"true\";\r\n    }\r\n    getBooleanOrDefault(key) {\r\n        return process.env[key] ? process.env[key] === \"true\" : undefined;\r\n    }\r\n}\r\nexports.BaseConfig = BaseConfig;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/config/BaseConfig.ts?");

/***/ }),

/***/ "./src/core/config/EnvConfig.ts":
/*!**************************************!*\
  !*** ./src/core/config/EnvConfig.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.EnvConfig = void 0;\r\nconst BaseConfig_1 = __webpack_require__(/*! ./BaseConfig */ \"./src/core/config/BaseConfig.ts\");\r\nclass EnvConfig extends BaseConfig_1.BaseConfig {\r\n    get clientHostName() {\r\n        return this.isProduction === true\r\n            ? EnvConfig.productionDomain\r\n            : EnvConfig.developmentDomain;\r\n    }\r\n    get port() {\r\n        return this.getInt(\"PORT\");\r\n    }\r\n    get type() {\r\n        return this.getString(\"NODE_ENV\");\r\n    }\r\n    get isDevelopment() {\r\n        return this.type === \"development\";\r\n    }\r\n    get isProduction() {\r\n        return this.type === \"production\";\r\n    }\r\n}\r\nexports.EnvConfig = EnvConfig;\r\nEnvConfig.productionDomain = \"https://luggage-game.vercel.app\";\r\nEnvConfig.developmentDomain = \"http://localhost:3000\";\r\nEnvConfig.allowedOrigins = [\r\n    EnvConfig.productionDomain,\r\n    EnvConfig.developmentDomain\r\n];\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/config/EnvConfig.ts?");

/***/ }),

/***/ "./src/core/config/MongoConfig.ts":
/*!****************************************!*\
  !*** ./src/core/config/MongoConfig.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.MongoConfig = void 0;\r\nconst BaseConfig_1 = __webpack_require__(/*! ./BaseConfig */ \"./src/core/config/BaseConfig.ts\");\r\nconst EnvConfig_1 = __webpack_require__(/*! ./EnvConfig */ \"./src/core/config/EnvConfig.ts\");\r\nclass MongoConfig extends BaseConfig_1.BaseConfig {\r\n    constructor() {\r\n        super();\r\n        this.envConfig = new EnvConfig_1.EnvConfig();\r\n    }\r\n    get uri() {\r\n        return this.envConfig.isProduction === true\r\n            ? this.getString(\"MONGO_URI_PROD\")\r\n            : this.getString(\"MONGO_URI_DEV\");\r\n    }\r\n    get uriDisplayName() {\r\n        return this.envConfig.isProduction === true\r\n            ? \"PROD database\"\r\n            : \"DEV database\";\r\n    }\r\n    get options() {\r\n        const options = {\r\n            useNewUrlParser: true,\r\n            useUnifiedTopology: true,\r\n        };\r\n        return options;\r\n    }\r\n}\r\nexports.MongoConfig = MongoConfig;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/config/MongoConfig.ts?");

/***/ }),

/***/ "./src/core/config/PassportConfig.ts":
/*!*******************************************!*\
  !*** ./src/core/config/PassportConfig.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.PassportConfig = void 0;\r\nconst passport_jwt_1 = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\r\nconst BaseConfig_1 = __webpack_require__(/*! ./BaseConfig */ \"./src/core/config/BaseConfig.ts\");\r\nconst EnvConfig_1 = __webpack_require__(/*! ./EnvConfig */ \"./src/core/config/EnvConfig.ts\");\r\nclass PassportConfig extends BaseConfig_1.BaseConfig {\r\n    constructor() {\r\n        super();\r\n        this.envConfig = new EnvConfig_1.EnvConfig();\r\n    }\r\n    get expiresIn() {\r\n        return 604800; // 7 days in seconds\r\n    }\r\n    get localStrategyOptions() {\r\n        return {\r\n            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),\r\n            secretOrKey: this.secret,\r\n            passReqToCallback: true, // <= Important, so that the verify function can accept the req param ie verify(req,payload,done)\r\n        };\r\n    }\r\n    get secret() {\r\n        return this.getString(\"JWT_SECRET\");\r\n    }\r\n}\r\nexports.PassportConfig = PassportConfig;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/config/PassportConfig.ts?");

/***/ }),

/***/ "./src/core/config/index.ts":
/*!**********************************!*\
  !*** ./src/core/config/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.PassportConfig = exports.MongoConfig = exports.EnvConfig = void 0;\r\nvar EnvConfig_1 = __webpack_require__(/*! ./EnvConfig */ \"./src/core/config/EnvConfig.ts\");\r\nObject.defineProperty(exports, \"EnvConfig\", ({ enumerable: true, get: function () { return EnvConfig_1.EnvConfig; } }));\r\nvar MongoConfig_1 = __webpack_require__(/*! ./MongoConfig */ \"./src/core/config/MongoConfig.ts\");\r\nObject.defineProperty(exports, \"MongoConfig\", ({ enumerable: true, get: function () { return MongoConfig_1.MongoConfig; } }));\r\nvar PassportConfig_1 = __webpack_require__(/*! ./PassportConfig */ \"./src/core/config/PassportConfig.ts\");\r\nObject.defineProperty(exports, \"PassportConfig\", ({ enumerable: true, get: function () { return PassportConfig_1.PassportConfig; } }));\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/config/index.ts?");

/***/ }),

/***/ "./src/core/logic/HttpController.ts":
/*!******************************************!*\
  !*** ./src/core/logic/HttpController.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.HttpController = void 0;\r\nconst Result_1 = __webpack_require__(/*! ./Result */ \"./src/core/logic/Result.ts\");\r\nclass HttpController {\r\n    execute(req, res) {\r\n        this.req = req;\r\n        this.res = res;\r\n        try {\r\n            const promise = this.executeImpl(req, res);\r\n            promise.then((result) => {\r\n                if (result instanceof Result_1.Result) {\r\n                    this.respondWithResult(result);\r\n                }\r\n                else if (result) {\r\n                    this.json(result.statusCode, result.body);\r\n                }\r\n            });\r\n        }\r\n        catch (err) {\r\n            this.fail(\"Cannot execute given request\");\r\n        }\r\n    }\r\n    static jsonResponse(res, code, message) {\r\n        return res.status(code).json({ message, statusCode: code });\r\n    }\r\n    ok(dto) {\r\n        if (!!dto) {\r\n            return this.res.status(200).json(dto);\r\n        }\r\n        else {\r\n            return this.res.sendStatus(200);\r\n        }\r\n    }\r\n    created(res) {\r\n        return res.sendStatus(201);\r\n    }\r\n    json(code, body) {\r\n        return this.res.status(code).json(body);\r\n    }\r\n    clientError(message) {\r\n        return HttpController.jsonResponse(this.res, 400, message ? message : \"Wrong request\");\r\n    }\r\n    unauthorized(message) {\r\n        return HttpController.jsonResponse(this.res, 401, message ? message : \"Unauthorized\");\r\n    }\r\n    paymentRequired(message) {\r\n        return HttpController.jsonResponse(this.res, 402, message ? message : \"Payment required\");\r\n    }\r\n    forbidden(message) {\r\n        return HttpController.jsonResponse(this.res, 403, message ? message : \"Forbidden\");\r\n    }\r\n    notFound(message) {\r\n        return HttpController.jsonResponse(this.res, 404, message ? message : \"Not found\");\r\n    }\r\n    conflict(message) {\r\n        return HttpController.jsonResponse(this.res, 409, message ? message : \"Conflict\");\r\n    }\r\n    tooMany(message) {\r\n        return HttpController.jsonResponse(this.res, 429, message ? message : \"Too many requests\");\r\n    }\r\n    fail(error) {\r\n        if (typeof error === \"string\") {\r\n            console.log(`Fail: ${error}`);\r\n            return this.res.status(500).json({ statusCode: 500, message: error });\r\n        }\r\n        else {\r\n            console.log(`Fail: ${error.message}`);\r\n            if (error.body) {\r\n                return this.res.status(error.statusCode).json(error.body);\r\n            }\r\n            else {\r\n                return this.res.status(error.statusCode).json({\r\n                    statusCode: error.statusCode,\r\n                    message: error.message,\r\n                });\r\n            }\r\n        }\r\n    }\r\n    respondWithResult(result) {\r\n        if (result.isFailure) {\r\n            this.fail(result.error);\r\n        }\r\n        else {\r\n            this.ok(result.value);\r\n        }\r\n    }\r\n}\r\nexports.HttpController = HttpController;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/logic/HttpController.ts?");

/***/ }),

/***/ "./src/core/logic/Result.ts":
/*!**********************************!*\
  !*** ./src/core/logic/Result.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Result = void 0;\r\nclass Result {\r\n    constructor(isSuccess, error, value) {\r\n        if (isSuccess && error) {\r\n            throw new Error(\"InvalidOperation: A result cannot be successful and contain an error\");\r\n        }\r\n        if (!isSuccess && !error) {\r\n            throw new Error(\"InvalidOperation: A failing result needs to contain an error message\");\r\n        }\r\n        if (typeof error === \"string\") {\r\n            this._error = { statusCode: 500, message: error };\r\n        }\r\n        else if (error instanceof Error) {\r\n            this._error = { statusCode: 500, message: error.message };\r\n        }\r\n        else {\r\n            this._error = error;\r\n        }\r\n        this.isSuccess = isSuccess;\r\n        this._value = value;\r\n        Object.freeze(this);\r\n    }\r\n    get isFailure() {\r\n        return !this.isSuccess;\r\n    }\r\n    get error() {\r\n        if (this.isSuccess) {\r\n            console.log(this.error);\r\n            throw new Error(\"Can't get the value of an result. Use 'value' instead.\");\r\n        }\r\n        return this._error;\r\n    }\r\n    get value() {\r\n        if (!this.isSuccess) {\r\n            console.log(this.error);\r\n            throw new Error(\"Can't get the value of an error result. Use 'error' instead.\");\r\n        }\r\n        return this._value;\r\n    }\r\n    static ok(value) {\r\n        return new Result(true, null, value);\r\n    }\r\n    static fail(error) {\r\n        return new Result(false, error);\r\n    }\r\n}\r\nexports.Result = Result;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/logic/Result.ts?");

/***/ }),

/***/ "./src/core/logic/index.ts":
/*!*********************************!*\
  !*** ./src/core/logic/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Result = exports.HttpController = void 0;\r\nvar HttpController_1 = __webpack_require__(/*! ./HttpController */ \"./src/core/logic/HttpController.ts\");\r\nObject.defineProperty(exports, \"HttpController\", ({ enumerable: true, get: function () { return HttpController_1.HttpController; } }));\r\nvar Result_1 = __webpack_require__(/*! ./Result */ \"./src/core/logic/Result.ts\");\r\nObject.defineProperty(exports, \"Result\", ({ enumerable: true, get: function () { return Result_1.Result; } }));\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/logic/index.ts?");

/***/ }),

/***/ "./src/core/middlewares/AuthMiddleware.ts":
/*!************************************************!*\
  !*** ./src/core/middlewares/AuthMiddleware.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst passport_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! passport */ \"passport\"));\r\nexports[\"default\"] = passport_1.default.authenticate(\"jwt\", { session: false });\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/middlewares/AuthMiddleware.ts?");

/***/ }),

/***/ "./src/core/middlewares/CorsMiddleware.ts":
/*!************************************************!*\
  !*** ./src/core/middlewares/CorsMiddleware.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst config_1 = __webpack_require__(/*! @core/config */ \"./src/core/config/index.ts\");\r\nfunction corsMiddleware(req, res, next) {\r\n    const { allowedOrigins } = config_1.EnvConfig;\r\n    const origin = req.headers.origin;\r\n    if (allowedOrigins.includes(origin)) {\r\n        res.setHeader(\"Access-Control-Allow-Origin\", origin);\r\n    }\r\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept, Authorization\");\r\n    res.header(\"Access-Control-Allow-Methods\", \"*\");\r\n    if (req.method === \"OPTIONS\" &&\r\n        !!req.header(\"Access-Control-Request-Method\")) {\r\n        // CORS Preflight check - bounce back the request\r\n        res.status(204).send();\r\n    }\r\n    else {\r\n        next();\r\n    }\r\n}\r\nexports[\"default\"] = corsMiddleware;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/middlewares/CorsMiddleware.ts?");

/***/ }),

/***/ "./src/core/middlewares/index.ts":
/*!***************************************!*\
  !*** ./src/core/middlewares/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.CorsMiddleware = exports.AuthMiddleware = void 0;\r\nvar AuthMiddleware_1 = __webpack_require__(/*! ./AuthMiddleware */ \"./src/core/middlewares/AuthMiddleware.ts\");\r\nObject.defineProperty(exports, \"AuthMiddleware\", ({ enumerable: true, get: function () { return __importDefault(AuthMiddleware_1).default; } }));\r\nvar CorsMiddleware_1 = __webpack_require__(/*! ./CorsMiddleware */ \"./src/core/middlewares/CorsMiddleware.ts\");\r\nObject.defineProperty(exports, \"CorsMiddleware\", ({ enumerable: true, get: function () { return __importDefault(CorsMiddleware_1).default; } }));\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/core/middlewares/index.ts?");

/***/ }),

/***/ "./src/database/index.ts":
/*!*******************************!*\
  !*** ./src/database/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.UserModel = void 0;\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst UserModel_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! ./models/UserModel */ \"./src/database/models/UserModel.ts\"));\r\nexports.UserModel = UserModel_1.default;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/database/index.ts?");

/***/ }),

/***/ "./src/database/models/UserModel.ts":
/*!******************************************!*\
  !*** ./src/database/models/UserModel.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst UserSchema = new mongoose_1.Schema({\r\n    username: { type: String, required: true },\r\n    email: { type: String, required: true },\r\n    coins: { type: Number, required: true },\r\n    password: { type: String, required: true },\r\n    avatar: String,\r\n});\r\nUserSchema.virtual(\"payload\").get(function () {\r\n    return {\r\n        id: this.id,\r\n        username: this.username,\r\n        email: this.email,\r\n        avatar: this.avatar,\r\n    };\r\n});\r\nexports[\"default\"] = (0, mongoose_1.model)(\"user\", UserSchema);\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/database/models/UserModel.ts?");

/***/ }),

/***/ "./src/features/test/router/index.ts":
/*!*******************************************!*\
  !*** ./src/features/test/router/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.TestPrivateRouter = exports.TestPublicRouter = void 0;\r\nconst express_1 = __webpack_require__(/*! express */ \"express\");\r\nconst TestPublicRouter = {\r\n    path: \"/test/public\",\r\n    router: (0, express_1.Router)(),\r\n    authRequired: false,\r\n};\r\nexports.TestPublicRouter = TestPublicRouter;\r\nconst TestPrivateRouter = {\r\n    path: \"/test/private\",\r\n    router: (0, express_1.Router)(),\r\n    authRequired: true,\r\n};\r\nexports.TestPrivateRouter = TestPrivateRouter;\r\nTestPublicRouter.router.get(\"/\", (req, res) => {\r\n    res.send({\r\n        message: \"This is public route\"\r\n    });\r\n});\r\nTestPrivateRouter.router.get(\"/\", (req, res) => {\r\n    res.send({\r\n        message: \"This is private route. Auth token is required.\"\r\n    });\r\n});\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/test/router/index.ts?");

/***/ }),

/***/ "./src/features/users/actions/login/LoginController.ts":
/*!*************************************************************!*\
  !*** ./src/features/users/actions/login/LoginController.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.LoginController = void 0;\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst logic_1 = __webpack_require__(/*! @core/logic */ \"./src/core/logic/index.ts\");\r\nconst LoginUseCase_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! ./LoginUseCase */ \"./src/features/users/actions/login/LoginUseCase.ts\"));\r\nconst Global_1 = __webpack_require__(/*! @utils/Global */ \"./src/utils/Global.ts\");\r\nclass LoginController extends logic_1.HttpController {\r\n    async executeImpl(req) {\r\n        const useCase = new LoginUseCase_1.default();\r\n        const request = {\r\n            email: req.body.email,\r\n            password: req.body.password\r\n        };\r\n        const emptyErrors = (0, Global_1.getEmptyErrors)(request);\r\n        if (emptyErrors) {\r\n            this.json(400, emptyErrors);\r\n        }\r\n        const result = await useCase.execute(request);\r\n        this.respondWithResult(result);\r\n        // or alternatively: return result;\r\n    }\r\n}\r\nexports.LoginController = LoginController;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/users/actions/login/LoginController.ts?");

/***/ }),

/***/ "./src/features/users/actions/login/LoginUseCase.ts":
/*!**********************************************************!*\
  !*** ./src/features/users/actions/login/LoginUseCase.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.LoginUseCase = void 0;\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst bcryptjs_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! bcryptjs */ \"bcryptjs\"));\r\nconst jsonwebtoken_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\"));\r\nconst config_1 = __webpack_require__(/*! @core/config */ \"./src/core/config/index.ts\");\r\nconst logic_1 = __webpack_require__(/*! @core/logic */ \"./src/core/logic/index.ts\");\r\nconst _database_1 = __webpack_require__(/*! @database */ \"./src/database/index.ts\");\r\nconst User_1 = __webpack_require__(/*! @utils/User */ \"./src/utils/User.ts\");\r\nclass LoginUseCase {\r\n    constructor() {\r\n        this.passportConfig = new config_1.PassportConfig();\r\n        this.incorrectDetailsError = {\r\n            statusCode: 400,\r\n            message: \"Incorrect details\",\r\n        };\r\n    }\r\n    async execute(request) {\r\n        const user = await _database_1.UserModel.findOne({\r\n            email: request.email,\r\n        }).exec();\r\n        if (!user) {\r\n            return logic_1.Result.fail(this.incorrectDetailsError);\r\n        }\r\n        const isMatch = await bcryptjs_1.default.compare(request.password, user.password);\r\n        if (!isMatch) {\r\n            return logic_1.Result.fail(this.incorrectDetailsError);\r\n        }\r\n        const token = jsonwebtoken_1.default.sign((0, User_1.getPayload)(user), this.passportConfig.secret, {\r\n            expiresIn: this.passportConfig.expiresIn,\r\n        });\r\n        return logic_1.Result.ok({\r\n            success: true,\r\n            token: \"Bearer \" + token,\r\n        });\r\n    }\r\n}\r\nexports.LoginUseCase = LoginUseCase;\r\nexports[\"default\"] = LoginUseCase;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/users/actions/login/LoginUseCase.ts?");

/***/ }),

/***/ "./src/features/users/actions/register/RegisterController.ts":
/*!*******************************************************************!*\
  !*** ./src/features/users/actions/register/RegisterController.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.RegisterController = void 0;\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst logic_1 = __webpack_require__(/*! @core/logic */ \"./src/core/logic/index.ts\");\r\nconst RegisterUseCase_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! ./RegisterUseCase */ \"./src/features/users/actions/register/RegisterUseCase.ts\"));\r\nconst Global_1 = __webpack_require__(/*! @utils/Global */ \"./src/utils/Global.ts\");\r\nclass RegisterController extends logic_1.HttpController {\r\n    async executeImpl(req) {\r\n        const useCase = new RegisterUseCase_1.default();\r\n        const request = {\r\n            username: req.body.username,\r\n            email: req.body.email,\r\n            password: req.body.password,\r\n            password2: req.body.password2,\r\n        };\r\n        const emptyErrors = (0, Global_1.getEmptyErrors)(request);\r\n        if (emptyErrors) {\r\n            return { statusCode: 400, body: emptyErrors };\r\n        }\r\n        if (!this.emailIsValid(request.email)) {\r\n            return {\r\n                statusCode: 400,\r\n                body: {\r\n                    errors: {\r\n                        email: \"Invalid email address\",\r\n                    },\r\n                },\r\n            };\r\n        }\r\n        if (request.password !== request.password2) {\r\n            return {\r\n                statusCode: 400,\r\n                body: {\r\n                    errors: {\r\n                        password: \"Passwords don't match\",\r\n                    },\r\n                },\r\n            };\r\n        }\r\n        return await useCase.execute(request);\r\n        // or this.respondWithResult(result);\r\n    }\r\n    emailIsValid(email) {\r\n        const reg = new RegExp(/^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/);\r\n        return reg.test(email);\r\n    }\r\n}\r\nexports.RegisterController = RegisterController;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/users/actions/register/RegisterController.ts?");

/***/ }),

/***/ "./src/features/users/actions/register/RegisterUseCase.ts":
/*!****************************************************************!*\
  !*** ./src/features/users/actions/register/RegisterUseCase.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\nconst bcryptjs_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! bcryptjs */ \"bcryptjs\"));\r\nconst logic_1 = __webpack_require__(/*! @core/logic */ \"./src/core/logic/index.ts\");\r\nconst _database_1 = __webpack_require__(/*! @database */ \"./src/database/index.ts\");\r\nclass RegisterUseCase {\r\n    async execute(request) {\r\n        let existingUser = await _database_1.UserModel.findOne({\r\n            email: request.email,\r\n        }).exec();\r\n        if (existingUser) {\r\n            return logic_1.Result.fail({\r\n                statusCode: 400,\r\n                message: \"Duplicate error\",\r\n                body: {\r\n                    errors: {\r\n                        email: \"User with this email exists\"\r\n                    }\r\n                }\r\n            });\r\n        }\r\n        existingUser = await _database_1.UserModel.findOne({\r\n            username: request.username,\r\n        }).exec();\r\n        if (existingUser) {\r\n            return logic_1.Result.fail({\r\n                statusCode: 400,\r\n                message: \"Duplicate error\",\r\n                body: {\r\n                    errors: {\r\n                        username: \"User with this username exists\"\r\n                    }\r\n                }\r\n            });\r\n        }\r\n        const newUser = new _database_1.UserModel({\r\n            username: request.username,\r\n            email: request.email,\r\n            password: await this.createHash(request.password),\r\n            coins: 10000\r\n        });\r\n        const newUserResult = await newUser.save();\r\n        return logic_1.Result.ok(newUserResult);\r\n    }\r\n    async createHash(password) {\r\n        const salt = await bcryptjs_1.default.genSalt(10);\r\n        return await bcryptjs_1.default.hash(password, salt);\r\n    }\r\n}\r\nexports[\"default\"] = RegisterUseCase;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/users/actions/register/RegisterUseCase.ts?");

/***/ }),

/***/ "./src/features/users/router/index.ts":
/*!********************************************!*\
  !*** ./src/features/users/router/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst express_1 = __webpack_require__(/*! express */ \"express\");\r\nconst LoginController_1 = __webpack_require__(/*! ../actions/login/LoginController */ \"./src/features/users/actions/login/LoginController.ts\");\r\nconst RegisterController_1 = __webpack_require__(/*! ../actions/register/RegisterController */ \"./src/features/users/actions/register/RegisterController.ts\");\r\nconst UserRouter = {\r\n    path: \"/users\",\r\n    router: (0, express_1.Router)(),\r\n    authRequired: false,\r\n};\r\nUserRouter.router.post(\"/login\", (req, res) => new LoginController_1.LoginController().execute(req, res));\r\nUserRouter.router.post(\"/register\", (req, res) => new RegisterController_1.RegisterController().execute(req, res));\r\nexports[\"default\"] = UserRouter;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/features/users/router/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst tslib_1 = __webpack_require__(/*! tslib */ \"tslib\");\r\n__webpack_require__(/*! dotenv/config */ \"dotenv/config\");\r\nconst App_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! ./App */ \"./src/App.ts\"));\r\nconst router_1 = (0, tslib_1.__importDefault)(__webpack_require__(/*! @features/users/router */ \"./src/features/users/router/index.ts\"));\r\nconst router_2 = __webpack_require__(/*! @features/test/router */ \"./src/features/test/router/index.ts\");\r\nconst primaryRoutes = [router_1.default, router_2.TestPublicRouter];\r\nconst secondaryRoutes = [router_2.TestPrivateRouter];\r\nconst app = new App_1.default([].concat(primaryRoutes, secondaryRoutes), \"/api\");\r\napp.listen();\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/index.ts?");

/***/ }),

/***/ "./src/utils/Global.ts":
/*!*****************************!*\
  !*** ./src/utils/Global.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.getEmptyErrors = exports.capitalize = exports.getEmptyPropertyKeys = exports.isEmpty = void 0;\r\nconst isEmpty = (object) => {\r\n    return (object === undefined ||\r\n        object === null ||\r\n        object === 0 ||\r\n        object === \"\" ||\r\n        (typeof object === \"object\" && Object.keys(object).length === 0));\r\n};\r\nexports.isEmpty = isEmpty;\r\nconst getEmptyPropertyKeys = (obj, allowEmptyString) => {\r\n    const keys = [];\r\n    for (const prop in obj) {\r\n        if ((0, exports.isEmpty)(obj[prop])) {\r\n            if (allowEmptyString && typeof obj[prop] === \"string\") {\r\n                continue;\r\n            }\r\n            keys.push(prop);\r\n        }\r\n    }\r\n    return keys;\r\n};\r\nexports.getEmptyPropertyKeys = getEmptyPropertyKeys;\r\nfunction capitalize(text) {\r\n    return text.charAt(0).toUpperCase() + text.slice(1);\r\n}\r\nexports.capitalize = capitalize;\r\nfunction getEmptyErrors(obj) {\r\n    const emptyProps = (0, exports.getEmptyPropertyKeys)(obj);\r\n    if (emptyProps.length > 0) {\r\n        const resultBody = {\r\n            errors: {}\r\n        };\r\n        for (const prop of emptyProps) {\r\n            resultBody.errors[prop] = `${capitalize(prop)} is required`;\r\n        }\r\n        return resultBody;\r\n    }\r\n    else {\r\n        return null;\r\n    }\r\n}\r\nexports.getEmptyErrors = getEmptyErrors;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/utils/Global.ts?");

/***/ }),

/***/ "./src/utils/User.ts":
/*!***************************!*\
  !*** ./src/utils/User.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.getPayload = void 0;\r\nfunction getPayload(user) {\r\n    return {\r\n        id: user.id,\r\n        username: user.username,\r\n        email: user.email,\r\n        avatar: user.avatar,\r\n    };\r\n}\r\nexports.getPayload = getPayload;\r\n\n\n//# sourceURL=webpack://luggage-game-api/./src/utils/User.ts?");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "envalid":
/*!**************************!*\
  !*** external "envalid" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("envalid");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-rate-limit":
/*!*************************************!*\
  !*** external "express-rate-limit" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-rate-limit");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("passport");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;