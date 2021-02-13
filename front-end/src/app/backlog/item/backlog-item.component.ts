import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BacklogItemGetResponseBase } from '@core/api-models/backlog-item/item/BacklogItemGetResponseBase';
import { BugAddUpdRequest } from '@core/api-models/backlog-item/item/BugAddUpdRequest';
import { UserStoryAddUpdRequest } from '@core/api-models/backlog-item/item/UserStoryAddUpdRequest';
import { BacklogItemType } from '@core/api-models/common/BacklogItemType';
import { BacklogItemsService } from '@core/api-services/backlogItems.service';
import { NotificationService } from '@core/notification/notification.service';
import { IBreadcrumbItem, PageTitleService } from '@core/page-title.service';
import { CustomValidators } from '@utils/custom-validators';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type BacklogAddUpdDto = BugAddUpdRequest & UserStoryAddUpdRequest;

@Component({
	templateUrl: './backlog-item.component.html',
	styleUrls: ['./backlog-item.component.scss'],
})
export class BacklogItemComponent implements OnInit {
	editId: string | null = null;
	form!: FormGroupTyped<BacklogAddUpdDto>;
	dtoBeforeUpdate: BacklogItemGetResponseBase | undefined;

	get typeTitle(): BacklogItemType | undefined {
		return !!this.dtoBeforeUpdate ? BacklogItemType[this.dtoBeforeUpdate.type] : undefined;
	}

	private subscriptions = new Subscription();
	private _listRoute = '/backlog-items';

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private apiService: BacklogItemsService,
		private notifyService: NotificationService,
		private pageTitle: PageTitleService,
		private location: Location
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			title: [null, [CustomValidators.required()]],
			assigneeId: [null],
			tags: [null],
			relatedItems: [null],
			customFields: [null],
		}) as FormGroupTyped<BacklogAddUpdDto>;

		this.subscriptions.add(
			this.activatedRoute.paramMap
				.pipe(
					switchMap((p: ParamMap) => {
						const id = p.get('id');
						this.editId = !!id && id !== 'create' ? id : null;
						return !!this.editId ? this.apiService.getBacklogItem(this.editId) : of({} as BacklogItemGetResponseBase);
					})
				)
				.subscribe(item => {
					this.dtoBeforeUpdate = item;
					this.form.reset(item);
					const lastBreadcrumbs: IBreadcrumbItem = {
						label: !!this.editId ? `#${this.editId}` : 'Create',
						url: '',
					};
					this.pageTitle.addLastBreadcrumbs(lastBreadcrumbs);
				})
		);
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	save(): void {
		/*var saveCmd = !!this.editId
			? this.apiService.updateUser(this.editId, this.form.value)
			: this.apiService.createUser(this.form.value);
		saveCmd.pipe(take(1)).subscribe(
			ref => {
				const notification = {
					linkRoute: [this._listRoute, ref.id],
					linkText: ref.name,
					text: 'User saved:',
				} as INotificationMessage;
				this.notifyService.showNotificationWithLink(notification);
				this.goBack();
			},
			err => {
				this.notifyService.showError('Failed to save', `Saving custom field failed: '${err}'`);
			}
		);*/
	}

	delete(): void {
		if (!this.editId) return;

		/*this.notifyService
			.showDeleteConfirmation('Delete Custom Field?', `Do you want delete '<b>${this._userDtoBeforeUpdate?.nameWithInitials}</b>'?`)
			.pipe(
				filter(r => r),
				switchMap(() => this.apiService.deleteUser(this.editId!)),
				take(1)
			)
			.subscribe(
				ref => {
					this.notifyService.showNotification(`User '${ref.name}' deleted`);
					this.goBack();
				},
				err => {
					this.notifyService.showError('Failed to delete', `Deleting user failed: '${err}'`);
				}
			);*/
	}

	goBack(): void {
		if (window.history.length > 1) this.location.back();
		else this.router.navigate([this._listRoute]);
	}
}
