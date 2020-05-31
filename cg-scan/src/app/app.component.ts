import { Component, ViewChild, AfterViewInit  } from '@angular/core';

import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import {ThemePalette} from '@angular/material/core';


import Quagga from 'quagga';

import ProductRegistryService from './products/registry';
import ScannerUtil from './scanner/scanner-util';
import _ from 'lodash';
import { ApprovalCode, ApprovalCodeUtil } from './products/approval-code';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'cg-scan';
  headerText = 'Click here to start scanning';
  barcodeValue = undefined;

  spinner = {
    color: 'primary',
    mode: 'indeterminate'
  }

  @ViewChild(BarecodeScannerLivestreamComponent)
    barecodeScanner: BarecodeScannerLivestreamComponent;
 
    errorMessages = undefined;
    productRegistry: ProductRegistryService;
    approvalCode = undefined;
    isScanning:boolean = false;
    diagnosticsOn = false;
    scannerDiagnostics = function scannerDiagnostics() {
      return JSON.stringify({
        scanner: ScannerUtil.diagnostics(),
        approvalCode: this.approvalCode
      }, null, 4);
    }

    makeApprovalCode = function(code) {
      console.log('Making approval code ' + code)
      this.approvalCode = code;
    };
    makeApproved = function() {
      this.makeApprovalCode(ApprovalCode.Approved);
    };
    makeNotApproved = function() {
      this.makeApprovalCode(ApprovalCode.NotApproved);
    };
    makeUnknown = function() {
      this.makeApprovalCode(ApprovalCode.Unknown);
    };

    pushErrorMessages = function pushErrorMessages(message) {
      if (this.errorMessages === undefined) {
        this.errorMessages = [];
      }
      this.errorMessages.push(message);
    }

    stopScanning = function stopScanning() {
      console.log('Stopping scan.');
      this.isScanning = false;
      this.headerText = 'Click here to start scanning';
    }

    startScanning = function startScanning() {
      console.log('Starting scan.');
      ScannerUtil.resetCodeMap();
      this.isScanning = true;
      this.approvalCode = undefined;
      this.headerText = 'Scanning...';
    }
  
    ngAfterViewInit() {
        if (window.location.search.substr(1) === 'diagnostics=true') {
          this.diagnosticsOn = true;
        }
        if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
          this.pushErrorMessages('getUserMedia is not supported');
          return;
        }
        this.productRegistry = new ProductRegistryService();
        Quagga.init({
          inputStream: {
            constraints: {
              facingMode: 'environment'
            },
            area: { // defines rectangle of the detection/localization area
              top: '40%',    // top offset
              right: '0%',  // right offset
              left: '0%',   // left offset
              bottom: '40%'  // bottom offset
            },
          },
          decoder: {
            readers: ['upc_reader']
          },
        },
        (err) => {
          if (err) {
            this.pushErrorMessages(`QuaggaJS could not be initialized, err: ${err}`);
          } else {
            Quagga.start();
            Quagga.onDetected((res) => {
              this.onBarcodeScanned(res.codeResult.code);
            });
          }
        });

    }
    
    getApprovalCss(code: ApprovalCode) {
      let approvalClass: string = "info";
      if (code !== undefined) {
        approvalClass = ApprovalCodeUtil.getCssClass(code);
      }
      return approvalClass;
    }

    getApprovalMessage(code: ApprovalCode) {
      let approvalMessage: string = "";
      if (code !== undefined) {
        approvalMessage = ApprovalCodeUtil.getMessage(code);
      }
      return approvalMessage;
    }
 
    onBarcodeScanned(code: string) {
      if (this.isScanning && ScannerUtil.applyCode(code)) {
        this.approvalCode = this.productRegistry.approvalCode(code);
        this.barcodeValue = code;
        this.stopScanning();
      }
    }
}
