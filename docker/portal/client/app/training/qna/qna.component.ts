import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { QnA, QnATraining } from '../../shared/models/qna.model';
import { TrainingService } from '../../services/training.service';
import { DisplayNotificationService } from '../../services/display.notification';

@Component({
    selector: 'qna-app',
    templateUrl: './qna.component.html'
})
export class QnAComponent implements OnInit {

    constructor(private fb: FormBuilder,
        private trainingService: TrainingService,
        public toast: DisplayNotificationService) { }

    qnaForm: FormGroup;

    ngOnInit() {

        /* Initiate the form structure */
        this.qnaForm = this.fb.group({
            qna: this.fb.array([this.fb.group({ question: ['', Validators.required], answer: '' })])
        })
        this.trainingService.getQnASet().subscribe(
            res => {
                res.data.forEach((qna) => {
                    this.qnaRow.push(this.fb.group({ question: qna.question, answer: qna.answer }));
                })

            },
            error => this.toast.showToastNotification('Ooops Something went wrong with the bot', 'error')
        );
    }

    get qnaRow() {
        return this.qnaForm.get('qna') as FormArray;
    }


    addQnARow() {
        this.qnaRow.insert(0, this.fb.group({ question: '', answer: '' }));
    }

    deleteQnARow(index) {
        this.qnaRow.removeAt(index);
    }

    save(index) {
        let qna = this.qnaRow.at(index);
        if (qna.value.question !== "") {
            console.log(qna.value);
            this.trainingService.putQnA(new Array(qna.value)).subscribe(
                res => {
                    console.log("Inserted successfully");
                },
                error => this.toast.showToastNotification('Ooops Something went wrong with the bot', 'error')
            );

        }


    }

    startTraining() {
        
    }
}
