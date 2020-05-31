import { ApprovalCode, ApprovalCodeUtil } from './approval-code';

export default class Product {
    code: string;
    name: string;
    approvalCode: ApprovalCode;

    constructor(code: string, name: string, approved: boolean) {
        this.code = code;
        this.name = name;
        this.approvalCode = ApprovalCode.Unknown;
        if (approved) {
            this.approvalCode = ApprovalCode.Approved;
        } else {
            this.approvalCode = ApprovalCode.NotApproved;
        }
    }
}