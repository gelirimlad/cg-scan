export enum ApprovalCode {
    Approved,
    NotApproved,
    Unknown
}

export class ApprovalCodeUtil {
    static getCssClass(approvalCode: ApprovalCode) {
        let cssClass: string;
        switch (approvalCode) {
            case ApprovalCode.Approved:
                cssClass = 'approved';
                break;
            case ApprovalCode.NotApproved:
                cssClass = 'notapproved';
                break;
            case ApprovalCode.Unknown:
            default:
                cssClass = 'info'
                break;
        }
        return cssClass;
    }
    
    static getMessage(approvalCode: ApprovalCode) {
        let message: string;
        switch (approvalCode) {
            case ApprovalCode.Approved:
                message = 'Approved';
                break;
            case ApprovalCode.NotApproved:
                message = 'Not Approved';
                break;
            case ApprovalCode.Unknown:
            default:
                message = 'Sorry, we do not know this product.'
                break;
        }
        return message;
    }
}