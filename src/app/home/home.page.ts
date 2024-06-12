import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  task: string = '';
  tasks: string[] = [];
  editingIndex: number | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.loadTasks();
  }

  async loadTasks() {
    const storedTasks = await this.storage.get('tasks');
    if (storedTasks) {
      this.tasks = storedTasks;
    }
  }

  async addTask() {
    if (this.task.trim() !== '') {
      if (this.editingIndex !== null) {
        this.tasks[this.editingIndex] = this.task;
        this.editingIndex = null;
      } else {
        this.tasks.push(this.task);
      }
      this.task = '';
      await this.storage.set('tasks', this.tasks);
    }
  }

  editTask(index: number) {
    this.task = this.tasks[index];
    this.editingIndex = index;
  }

  async deleteTask(index: number) {
    this.tasks.splice(index, 1);
    await this.storage.set('tasks', this.tasks);
  }
}
