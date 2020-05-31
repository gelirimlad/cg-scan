import Product from './product';
import { ApprovalCode } from './approval-code';

export default class ProductRegistryService {
    private readonly _products = new Array<Product>();

    constructor() {
        this.addProduct(new Product('688047140103', 'Not Your Mothers Naturals', true));
        this.addProduct(new Product('603084547463', 'Garnier Fructis Grow Strong Fortifying Conditioner', true));
        this.addProduct(new Product('079400451866', 'Dove Men+ Care | Fortifying Shampoo', false));
    }

    get allProducts(): Array<Product> {
        return this._products;
    }

    get approvedProducts(): Array<Product> {
        return this._products.filter(a => a.approvalCode === ApprovalCode.Approved);
    }

    get unapprovedProducts(): Array<Product> {
        return this._products.filter(a => a.approvalCode === ApprovalCode.NotApproved);
    }

    approvalCode(code: string): ApprovalCode {
        let products: Product[];
        let approvalCode: ApprovalCode;
        products = this._products.filter(a => a.code === code);
        if (products.length > 0) {
            approvalCode = products[0].approvalCode;
        } else {
            approvalCode = ApprovalCode.Unknown;
        }
        return approvalCode;
    }

    addProduct(product: Product) {
        this._products.push(product);
    }
}