import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

interface Tarefa {
  descricao: string;
  categoria: string;
  dataVencimento: string;
  prioridade: string;
  concluida: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tarefa: string = '';
  categoria: string = '';
  dataVencimento: string = '';
  prioridade: string = 'Média';
  tarefas: Tarefa[] = [];
  indiceEdicao: number | null = null;
  filtro: string = 'todas';
  categorias: string[] = ['Trabalho', 'Estudos', 'Pessoal', 'Outros'];

  constructor(private storage: Storage, private toastController: ToastController) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.carregarTarefas();
  }

  async carregarTarefas() {
    const tarefasArmazenadas = await this.storage.get('tarefas');
    if (tarefasArmazenadas) {
      this.tarefas = tarefasArmazenadas;
    }
  }

  async adicionarTarefa() {
    if (this.tarefa.trim() !== '') {
      if (this.indiceEdicao !== null) {
        this.tarefas[this.indiceEdicao] = {
          descricao: this.tarefa,
          categoria: this.categoria,
          dataVencimento: this.dataVencimento,
          prioridade: this.prioridade,
          concluida: this.tarefas[this.indiceEdicao].concluida,
        };
        this.indiceEdicao = null;
      } else {
        this.tarefas.push({
          descricao: this.tarefa,
          categoria: this.categoria,
          dataVencimento: this.dataVencimento,
          prioridade: this.prioridade,
          concluida: false,
        });
      }
      this.tarefa = '';
      this.categoria = '';
      this.dataVencimento = '';
      this.prioridade = 'Média';
      await this.storage.set('tarefas', this.tarefas);
      this.mostrarMensagem('Tarefa salva com sucesso!');
    }
  }

  editarTarefa(index: number) {
    const tarefa = this.tarefas[index];
    this.tarefa = tarefa.descricao;
    this.categoria = tarefa.categoria;
    this.dataVencimento = tarefa.dataVencimento;
    this.prioridade = tarefa.prioridade;
    this.indiceEdicao = index;
  }

  async deletarTarefa(index: number) {
    this.tarefas.splice(index, 1);
    await this.storage.set('tarefas', this.tarefas);
    this.mostrarMensagem('Tarefa deletada com sucesso!');
  }

  async toggleConcluida(index: number) {
    this.tarefas[index].concluida = !this.tarefas[index].concluida;
    await this.storage.set('tarefas', this.tarefas);
  }

  tarefasFiltradas() {
    if (this.filtro === 'pendentes') {
      return this.tarefas.filter(tarefa => !tarefa.concluida);
    } else if (this.filtro === 'concluidas') {
      return this.tarefas.filter(tarefa => tarefa.concluida);
    } else if (this.filtro === 'altaPrioridade') {
      return this.tarefas.filter(tarefa => tarefa.prioridade === 'Alta');
    } else {
      return this.tarefas;
    }
  }

  async mostrarMensagem(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000
    });
    toast.present();
  }
}
