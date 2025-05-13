import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {DataTypeService} from './data-type.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import ReportTemplate, {
  ReportTemplateCreateRequest,
  ReportTemplateEditRequest,
  ReportTemplateWithCreator
} from '../model/report-template.model';
import {first, map, Observable, switchMap, tap} from 'rxjs';
import {CacheService} from './cache.service';
import DataType from '../model/data-type.model';

@Injectable({
  providedIn: 'root'
})
export class ReportTemplateService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly httpClient = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly cacheService = new CacheService<number, ReportTemplate>(template => template.id);
  private readonly instancesFetched = new Set<number>();
  private readonly templateInstanceId = new Map<number, number>();

  create(request: ReportTemplateCreateRequest): Observable<ReportTemplate> {
    return this.httpClient
      .post<ReportTemplate>(this.apiRouter.reportTemplate.create(request.instanceId), request)
      .pipe(
        map(template => this.updateProperties(template)),
        tap(template => {
          this.templateInstanceId.set(template.id, request.instanceId);
          this.cacheService.set(template);
        }),
        switchMap(template => this.cacheService.get(template.id))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.reportTemplate.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: ReportTemplateEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.reportTemplate.edit(request.instanceId, request.reportTemplate.id), request)
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.reportTemplate.id);

            this
              .getById(request.instanceId, request.reportTemplate.id)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<ReportTemplate> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<ReportTemplate>(this.apiRouter.reportTemplate.getById(instanceId, id))
      .pipe(
        map(template => this.updateProperties(template)),
        tap(template => this.cacheService.set(template)),
        switchMap(template => this.cacheService.get(template.id))
      );
  }

  getDataType(instanceId: number, template: ReportTemplate): Observable<DataType> {
    const dataTypeId = template.fields.at(0)!.dataTypeId;
    return this.dataTypeService.getById(instanceId, dataTypeId);
  }

  getWithCreatorById(instanceId: number, id: number): Observable<ReportTemplateWithCreator> {
    return this
      .getById(instanceId, id)
      .pipe(
        switchMap(template => this.userService
          .getIdentityById(template.createdById)
          .pipe(
            map(user => ({
              ...template,
              createdBy: user
            }))
          )
        )
      );
  }

  getAllByDataTypeId(instanceId: number, dataTypeId: number): Observable<ReportTemplate[]> {
    return this
      .getAllByInstanceId(instanceId)
      .pipe(
        // If any of the fields are within the data-type, think as this template is that data-type's
        // because templates are created only within one data-type's context
        map(templates => templates.filter(template => template.fields.some(field => field.dataTypeId === dataTypeId)))
      );
  }

  getAllByInstanceId(instanceId: number): Observable<ReportTemplate[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(template => this.templateInstanceId.get(template.id) === instanceId);
    }

    return this.httpClient
      .get<ReportTemplate[]>(this.apiRouter.reportTemplate.getByInstanceId(instanceId))
      .pipe(
        map(templates => templates.map(template => ({
          ...this.updateProperties(template),
          instanceId: instanceId
        }))),
        tap(templates => {
          this.instancesFetched.add(instanceId);

          templates.forEach(template => {
            this.templateInstanceId.set(template.id, instanceId);
          });

          this.cacheService.update(
            templates,
            template => this.templateInstanceId.get(template.id) === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(template =>
          this.templateInstanceId.get(template.id) === instanceId
        ))
      );
  }

  unmarkInstanceIdAsFetched(instanceId: number) {
    this.instancesFetched.delete(instanceId);
  }

  updateProperties(template: ReportTemplate): ReportTemplate {
    return {
      ...template,
      fields: template.fields.map(field => this.dataTypeService.updateFieldProperties(field))
    };
  }
}
