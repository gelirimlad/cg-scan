import _ from 'lodash';

export default class ScannerUtil {

    // Static values
    static confidenceThreshold: number = 50;
    // The number of scans to wait before we arrive at a confidence
    static numScansThreshold: number = 100;
    // Map for codes
    static codeMap: Map<string, number> = new Map<string, number>();
    // The current conidence code
    static currentConfidentCode: string;
    // The current max confidence code
    static currentMaxConfidence: number = 0;
    // The total number of codes detected including duplicates
    static totalCount: number = 0;

    static resetCodeMap(): void {
        this.codeMap = new Map<string, number>();
        this.currentMaxConfidence = 0;
        this.currentConfidentCode = undefined;
        this.totalCount = 0;
    }

    /**
     * Returns true if the code has passed our confidence threshold
     * @param code The code to apply to the scanner utility
     */
    static applyCode(code: string) : boolean {
        let currentNumber:number = this.codeMap.get(code);
        let response:boolean = false;
        this.totalCount ++;
        if (!_.isNaN(currentNumber)) {
            currentNumber ++;
        } else {
            currentNumber = 1;
        }
        this.codeMap.set(code, currentNumber);
        // Typical standard for a valid code being found
        if (currentNumber > this.currentMaxConfidence) {
            this.currentMaxConfidence = currentNumber;
            if (currentNumber > this.confidenceThreshold) {
                this.currentConfidentCode = code;
                response = true;
            }
        }
        if (this.totalCount > this.numScansThreshold && !response) { 
            // If we've arrived here and still have not got a confidence, we just take the closest we have
            let max:number = 0;
            this.codeMap.forEach((value: number, code: string) => {
                if (max < value) {
                    max = value;
                    this.currentConfidentCode = code;
                    this.currentMaxConfidence = max; // Technically this should already be true.
                }
            });
            response = true;
        }
        return response;
    }

    static mapToObject<V>(map: Map<string, V>) {
        return Array.from(
            map.entries()
          )
          .reduce((o, [key, value]) => { 
            o[key] = value; 
        
            return o; 
          }, {})
    }

    static diagnostics() {
        let diagnostics = {
            codeMap: this.mapToObject(this.codeMap),
            currentConfidentCode: this.currentConfidentCode,
            currentMaxConfidence: this.currentMaxConfidence,
            totalCount: this.totalCount
        };
        return diagnostics;
    }
    
}