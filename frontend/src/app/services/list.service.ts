import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment as env } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root"
})
export class ListService {
  // public baseUrl: string = "http://localhost:3000/api/v1";

  constructor(private http: HttpClient) {}

  public getAllList(userId, authToken): Observable<any> {
    return this.http.get(
      `${env.apiUrl}/lists/view/all/${userId}?authToken=${authToken}`
    );
  }

  public getAllPublicList(userId, authToken): Observable<any> {
    return this.http.get(
      `${env.apiUrl}/lists/view/all/public/${userId}?authToken=${authToken}`
    );
  }

  public getAllPrivateList(userId, authToken): Observable<any> {
    return this.http.get(
      `${env.apiUrl}/lists/view/all/private/${userId}?authToken=${authToken}`
    );
  }

  public getAllNotifications(userId, authToken): Observable<any> {
    return this.http.get(
      `${
        env.apiUrl
      }/lists/view/all/notifications/${userId}?authToken=${authToken}`
    );
  }

  public getList(listId, authToken): Observable<any> {
    return this.http.get(
      `${env.apiUrl}/lists/details/${listId}?authToken=${authToken}`
    );
  }

  public createList(newList, authToken): Observable<any> {
    const params = new HttpParams()
      .set("listName", newList.listName)
      .set("creatorId", newList.creatorId)
      .set("creatorName", newList.creatorName)
      .set("modifierId", newList.modifierId)
      .set("modifierName", newList.modifierName)
      .set("mode", newList.mode)
      .set("authToken", authToken);

    return this.http.post(`${env.apiUrl}/lists/create`, params);
  }

  public deleteList(listId, authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);

    return this.http.post(`${env.apiUrl}/lists/delete/${listId}`, params);
  }

  public createTask(newTask, authToken): Observable<any> {
    const params = new HttpParams()
      .set("listId", newTask.listId)
      .set("itemName", newTask.itemName)
      .set("itemCreatorId", newTask.itemCreatorId)
      .set("itemCreatorName", newTask.itemCreatorName)
      .set("itemModifierId", newTask.itemModifierId)
      .set("itemModifierName", newTask.itemModifierName)
      .set("authToken", authToken);

    return this.http.post(`${env.apiUrl}/items/create-item`, params);
  }

  public getAllTask(listId, authToken): Observable<any> {
    return this.http.get(
      `${env.apiUrl}/items/view/all/${listId}?authToken=${authToken}`
    );
  }

  public deleteTask(itemId, authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);

    return this.http.post(`${env.apiUrl}/items/delete-item/${itemId}`, params);
  }

  public createSubTask(newSubTask, authToken): Observable<any> {
    const params = new HttpParams()
      .set("itemId", newSubTask.itemId)
      .set("subItemName", newSubTask.subItemName)
      .set("subItemCreatorId", newSubTask.subItemCreatorId)
      .set("subItemCreatorName", newSubTask.subItemCreatorName)
      .set("subItemModifierId", newSubTask.subItemModifierId)
      .set("subItemModifierName", newSubTask.subItemModifierName)
      .set("authToken", authToken);

    return this.http.put(`${env.apiUrl}/items/create-sub-item`, params);
  }

  public deleteSubTask(itemId, obj): Observable<any> {
    const params = new HttpParams()
      .set("authToken", obj.authToken)
      .set("subItemId", obj.subItemId)
      .set("subItemModifierId", obj.subItemModifierId)
      .set("subItemModifierName", obj.subItemModifierName);
    return this.http.put(
      `${env.apiUrl}/items/delete-sub-item/${itemId}`,
      params
    );
  }

  public updateSubTask(subItem, itemId): Observable<any> {
    const params = new HttpParams()
      .set("subItemId", subItem.subItemId)
      .set("subItemName", subItem.subItemName)
      .set("subItemModifierId", subItem.modifierId)
      .set("subItemModifierName", subItem.modifierName)
      .set("authToken", subItem.authToken);

    return this.http.put(
      `${env.apiUrl}/items/update-sub-item/${itemId}`,
      params
    );
  }

  public updateTask(task): Observable<any> {
    const params = new HttpParams()
      .set("itemId", task.itemId)
      .set("itemName", task.itemName)
      .set("itemModifierId", task.itemModifierId)
      .set("itemModifierName", task.itemModifierName)
      .set("authToken", task.authToken);

    return this.http.put(
      `${env.apiUrl}/items/update-item/${task.itemId}`,
      params
    );
  }

  public updateList(list): Observable<any> {
    const params = new HttpParams()
      .set("listName", list.listName)
      .set("modifierId", list.modifierId)
      .set("modifierName", list.modifierName)
      .set("authToken", list.authToken);

    return this.http.put(`${env.apiUrl}/lists/update/${list.listId}`, params);
  }

  public updateFriendList(list): Observable<any> {
    const params = new HttpParams()
      .set("listName", list.listName)
      .set("modifierId", list.modifierId)
      .set("modifierName", list.modifierName)
      .set("authToken", list.authToken)
      .set("friendId", list.friendId)
      .set("friendName", list.friendName);

    return this.http.put(`${env.apiUrl}/lists/update/${list.listId}`, params);
  }

  public updateFriendTask(task): Observable<any> {
    const params = new HttpParams()
      .set("itemId", task.itemId)
      .set("itemName", task.itemName)
      .set("itemModifierId", task.itemModifierId)
      .set("itemModifierName", task.itemModifierName)
      .set("authToken", task.authToken)
      .set("friendId", task.friendId)
      .set("friendName", task.friendName);

    return this.http.put(
      `${env.apiUrl}/items/update-item/${task.itemId}`,
      params
    );
  }

  public updateFriendSubtask(subItem, itemId): Observable<any> {
    const params = new HttpParams()
      .set("subItemId", subItem.subItemId)
      .set("subItemName", subItem.subItemName)
      .set("subItemModifierId", subItem.modifierId)
      .set("subItemModifierName", subItem.modifierName)
      .set("authToken", subItem.authToken)
      .set("friendId", subItem.friendId)
      .set("friendName", subItem.friendName);

    return this.http.put(
      `${env.apiUrl}/items/update-sub-item/${itemId}`,
      params
    );
  }

  public deleteNotification(notificationId, authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);

    return this.http.post(
      `${env.apiUrl}/lists/delete/notification/${notificationId}`,
      params
    );
  }
}
