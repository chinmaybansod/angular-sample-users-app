import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private snackBar: MatSnackBar) { }

  showErrorMessage(errorMessage: string, errorOrSuccessBool: boolean): void {
    this.snackBar.open(errorMessage, '', {
      panelClass: errorOrSuccessBool ? 'error' : 'success',
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000
    })
  }
}
