"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const api_1 = __importDefault(require("../api"));
const models_1 = require("../../models");
/**
 * StoreController
 */
class CompanyController extends api_1.default {
    constructor() {
        super(...arguments);
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const offset = +(query.offset) | 0;
            const limit = +(query.limit) | 25;
            const companies = yield models_1.Company.find({}).select("-stores").skip(offset).limit(limit);
            this.responseSuccess(res, {
                data: {
                    offset,
                    limit,
                    companies
                },
            });
        });
        this.detail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const storeId = req.params.id;
            if (!storeId) {
                return this.responseBadRequest(res, {
                    error: "company_id_required"
                });
            }
            const store = yield models_1.Company.findOne({
                _id: storeId
            }).populate({
                path: "stores",
                populate: {
                    path: "users",
                    model: "users"
                }
            });
            if (!store) {
                return this.responseNotFound(res, {
                    error: "company_not_found"
                });
            }
            this.responseSuccess(res, {
                data: {
                    store
                },
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const companyId = req.params.id;
            if (!companyId) {
                return this.responseBadRequest(res, {
                    error: "company_id_required"
                });
            }
            const company = yield models_1.Company.findOne({
                _id: companyId
            });
            if (!company) {
                return this.responseNotFound(res, {
                    error: "company_not_found"
                });
            }
            company.email = body.email || "";
            company.name = body.name;
            company.phone = body.phone;
            company.representative_name = body.representative_name;
            company.post_code = body.post_code;
            company.address = body.address;
            company.url = body.url;
            const validator = yield company.validateSync();
            if (validator) {
                return this.responseBadRequest(res, {
                    error: validator.message
                });
            }
            yield company.save();
            this.responseSuccess(res, {
                message: "update_company_successfully",
                data: {
                    company
                },
            });
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const company = new models_1.Company();
            company.email = body.email || "";
            company.name = body.name;
            company.phone = body.phone;
            company.address = body.address;
            company.representative_name = body.representative_name;
            company.post_code = body.post_code;
            company.url = body.url;
            const validator = yield company.validateSync();
            if (validator) {
                return this.responseBadRequest(res, {
                    error: validator.message
                });
            }
            yield company.save();
            this.responseSuccess(res, {
                message: "create_company_successfully",
                data: {
                    company
                },
            });
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const companyId = req.params.id;
            const company = yield models_1.Company.findOneAndDelete({
                _id: companyId
            });
            if (!company) {
                return this.responseNotFound(res, {
                    error: "company_not_found"
                });
            }
            yield models_1.User.deleteMany({
                company_id: companyId,
                role: {
                    $ne: "admin"
                },
            });
            yield models_1.Menu.deleteMany({
                company_id: companyId,
            });
            this.responseSuccess(res, {
                message: "deleted_successfully",
            });
        });
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.js.map