import { Request, Response } from "express";
import API from "@/controllers/api";
import {Company, Menu, User} from "@/models";

/**
 * StoreController
 */
export class CompanyController extends API {

  list = async (req: Request, res: Response): Promise<any> => {
    const query = req.query as any;

    const offset = +(query.offset) | 0;
    const limit = +(query.limit) | 25;

    const companies = await Company.find({}).select("-stores").skip(offset).limit(limit);

    this.responseSuccess(res, {
      data: {
        offset,
        limit,
        companies
      },
    });
  };

  detail = async (req: Request, res: Response): Promise<any> => {
    const storeId = req.params.id;

    if(!storeId) {
      return this.responseBadRequest(res, {
        error: "company_id_required"
      });
    }

    const store = await Company.findOne({
      _id: storeId
    }).populate({
      path: "stores",
      populate: {
        path: "users",
        model: "users"
      }
    });

    if(!store) {
      return this.responseNotFound(res, {
        error: "company_not_found"
      });
    }

    this.responseSuccess(res, {
      data: {
        store
      },
    });
  };

  update = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;
    const companyId = req.params.id;

    if(!companyId) {
      return this.responseBadRequest(res, {
        error: "company_id_required"
      });
    }

    const company = await Company.findOne({
      _id: companyId
    });
    if(!company) {
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

    const validator = await company.validateSync();
    if(validator) {
      return this.responseBadRequest(res, {
        error: validator.message
      });
    }

    await company.save();

    this.responseSuccess(res, {
      message: "update_company_successfully",
      data: {
        company
      },
    });
  };


  create = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;

    const company = new Company();

    company.email = body.email || "";
    company.name = body.name;
    company.phone = body.phone;
    company.address = body.address;
    company.representative_name = body.representative_name;
    company.post_code = body.post_code;
    company.url = body.url;

    const validator = await company.validateSync();
    if(validator) {
      return this.responseBadRequest(res, {
        error: validator.message
      });
    }

    await company.save();

    this.responseSuccess(res, {
      message: "create_company_successfully",
      data: {
        company
      },
    });
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const companyId = req.params.id;

    const company = await Company.findOneAndDelete({
      _id: companyId
    });
    if(!company) {
      return this.responseNotFound(res, {
        error: "company_not_found"
      });
    }

    await User.deleteMany({
      company_id: companyId,
      role: {
        $ne: "admin"
      },
    });

    await Menu.deleteMany({
      company_id: companyId,
    });

    this.responseSuccess(res, {
      message: "deleted_successfully",
    });
  };
}
