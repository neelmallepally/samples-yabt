import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BacklogItemsService } from '@core/api-services/backlogItems.service';
import { ListBaseComponent } from '@core/base-list/list-base.component';
import { BacklogItemListGetRequest } from '@core/models/backlog-item/list/BacklogItemListGetRequest';
import { BacklogItemListGetResponse } from '@core/models/backlog-item/list/BacklogItemListGetResponse';

@Component({
	selector: 'backlog-list',
	styleUrls: ['./backlog-list.component.scss'],
	templateUrl: './backlog-list.component.html',
})
export class BacklogListComponent extends ListBaseComponent<BacklogItemListGetResponse, BacklogItemListGetRequest> {
	private static readonly defaultFilter: Partial<BacklogItemListGetRequest> = {
		currentUserRelation: undefined,
		types: [],
		states: [],
		tags: [],
		search: undefined,
		assignedUserId: undefined,
	};

	constructor(router: Router, activatedRoute: ActivatedRoute, apiService: BacklogItemsService) {
		super(
			router,
			activatedRoute,
			apiService,
			['number', 'title', 'assignee', 'state', 'created', 'updated'],
			BacklogListComponent.defaultFilter
		);
	}
}
