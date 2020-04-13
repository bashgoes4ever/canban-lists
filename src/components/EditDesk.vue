<template>
    <v-container>
        <h1>{{getDesk.title}}</h1>

        <draggable
                class="row"
                v-model="getDesk.columns"
                group="statuses"
                :list="getDesk.columns"
                @start="drag = true"
                @end="drag = false"
                v-bind="dragOptions"
                @change="updateDesk(getDesk)"
        >
            <v-simple-table
                    class="pa-2 table"
                    outlined
                    v-for="group in getDesk.columns"
                    :key="group.title"
            >
                <template v-slot:default>
                    <v-icon class="delete-col" @click="remove_column(group.id)">mdi-delete</v-icon>
                    <thead>
                    <tr>
                        <th>{{group.title}}</th>
                    </tr>
                    </thead>
                    <draggable
                            v-model="getDesk.columns"
                            group="tasks"
                            :list="group.tasks"
                            @start="drag = true"
                            @end="drag = false"
                            v-bind="dragOptions"
                            tag="tbody"
                            @change="updateDesk(getDesk)"
                    >
                        <tr
                                v-for="task in group.tasks"
                                :key="task.id">
                            <td @click="open_task_view(task.id, group.id)">{{task.title}}</td>
                        </tr>
                    </draggable>
                </template>
            </v-simple-table>
        </draggable>

        <div class="buttons__block">
            <v-dialog v-model="add_column_dialog" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="primary">Создать колонку</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Создание новой колонки</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Название*" v-model="new_column_title" required></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="add_column_dialog = false">Отмена</v-btn>
                        <v-btn color="blue darken-1" text @click="push_column" :disabled="!new_column_title">
                            Сохранить колонку
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="add_task_dialog" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="primary">Создать задачу</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">Создание новой задачи</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Название*" v-model="new_task.title" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Описание" v-model="new_task.description"
                                    ></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="new_task.deadline"
                                                    label="Дата завершения"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                ref="picker"
                                                v-model="new_task.deadline"
                                                min="1950-01-01"
                                                @change="save"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12">
                                    <v-select
                                            :items="getDesk.columns"
                                            v-model="new_task.status_id"
                                            required
                                            item-text="title"
                                            item-value="id"
                                            label="Статус задачи*"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="add_task_dialog = false">Отмена</v-btn>
                        <v-btn color="blue darken-1" text @click="push_task"
                               :disabled="!new_task.title || !new_task.status_id">
                            Добавить задачу
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                            v-on="on"
                    >
                        Перейти к другой доске
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(desk, index) in getAllDesks"
                            :to="`/desks/${desk.id}`"
                            :key="index"
                            @click=""
                    >
                        <v-list-item-title>{{ desk.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <v-dialog v-model="edit_task_dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Просмотр задачи</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Название" v-model="open_task.title" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="open_task.description">
                                <v-textarea label="Описание" v-model="open_task.description" readonly
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" v-if="open_task.deadline">
                                <v-text-field label="Дедлайн" v-model="open_task.deadline" readonly></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="open_task.comment || add_comment">
                                <v-textarea label="Комментарий" v-model="open_task.comment"
                                ></v-textarea>
                                <v-btn color="primary" @click="save_comment">Сохранить комментарий</v-btn>
                            </v-col>
                            <v-col cols="12" v-else>
                                <v-btn color="primary" @click="add_comment = true">Добавить комментарий</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="edit_task_dialog = false">Закрыть
                    </v-btn>
                    <v-dialog v-model="finish_task_dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" color="blue darken-1" text>Завершить задачу</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Завершение задачи</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-menu
                                                    ref="menu"
                                                    v-model="finish_menu"
                                                    :close-on-content-click="false"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                            v-model="open_task.finish_date"
                                                            label="Дата завершения"
                                                            readonly
                                                            v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                        ref="picker"
                                                        v-model="open_task.finish_date"
                                                        min="1950-01-01"
                                                        @change="save_and_call_api"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="finish_task_dialog = false">Отмена</v-btn>
                                <v-btn color="blue darken-1" text @click="finish_task" :disabled="!open_task.finish_date">
                                    Завершить задачу
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import draggable from "vuedraggable"
    import {mapActions} from 'vuex'

    export default {
        name: "Table",
        components: {
            draggable
        },
        data() {
            return {
                drag: false,
                menu: false,
                finish_menu: false,
                add_comment: false,
                edit_task_dialog: false,
                finish_task_dialog: false,
                add_column_dialog: false,
                add_task_dialog: false,
                new_column_title: '',
                new_task: {
                    'title': '',
                    'description': '',
                    'deadline': null,
                    'status_id': ''
                },
                open_task: {
                    'title': '',
                    'description': '',
                    'deadline': null,
                    'comment': '',
                    'id': null,
                    'column_id': null,
                    'finish_date': null
                }
            };
        },
        computed: {
            getDesk() {
                return this.$store.getters.getDeskById(+this.$route.params.id)
            },
            getAllDesks() {
                return this.$store.getters.getDesks
            },
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        },
        methods: {
            ...mapActions(['updateDesk', 'setAlert', 'apiCall']),
            push_column() {
                const col = {
                    'title': this.new_column_title,
                    'id': this.getDesk.columns.reduce((prev, current) => (prev.id > current.id) ? prev : current).id + 1,
                    'tasks': []
                }
                this.updateDesk(this.getDesk.columns.push(col))
                this.add_column_dialog = false
                this.new_column_title = ''
            },
            push_task() {
                this.getDesk.columns.find(col => col.id == this.new_task.status_id)['tasks'].push({
                    'id': +new Date(),
                    'title': this.new_task.title,
                    'description': this.new_task.description,
                    'deadline': this.new_task.deadline,
                })
                this.updateDesk(this.getDesk)
                this.add_task_dialog = false
                this.new_task = {
                    'title': '',
                    'description': '',
                    'deadline': null,
                    'status_id': ''
                }
            },
            remove_column(id) {
                const idx = this.getDesk.columns.findIndex(col => col.id == id)
                if (this.getDesk.columns[idx].tasks.length) this.setAlert({
                    'open': true,
                    'color': 'error',
                    'text': 'Нельзя удалить колонку, в которой есть элементы.'
                })
                else {
                    const desk = this.getDesk.columns.splice(idx, 1)
                    this.updateDesk(desk)
                }
            },
            open_task_view(task_id, column_id) {
                const task = this.getDesk.columns.find(col => col.id == column_id).tasks.find(task => task.id == task_id)
                this.open_task.title = task.title
                this.open_task.description = task.description
                this.open_task.deadline = task.deadline
                this.open_task.comment = task.comment
                this.open_task.column_id = column_id
                this.open_task.id = task_id
                this.edit_task_dialog = true
                this.open_task.finish_date = null
            },
            save_comment() {
                const col_idx = this.getDesk.columns.findIndex(col => col.id == this.open_task.column_id)
                const task_idx = this.getDesk.columns[col_idx].tasks.findIndex(task => task.id == this.open_task.id)
                this.getDesk.columns[col_idx].tasks[task_idx].comment = this.open_task.comment
                this.updateDesk(this.getDesk)
                this.setAlert({
                    'open': true,
                    'color': 'success',
                    'text': 'Комментарий сохранен.'
                })
            },
            finish_task() {
                const col_idx = this.getDesk.columns.findIndex(col => col.id == this.open_task.column_id)
                const task_idx = this.getDesk.columns[col_idx].tasks.findIndex(task => task.id == this.open_task.id)
                this.getDesk['finished_tasks'].unshift(this.getDesk.columns[col_idx].tasks[task_idx])
                this.getDesk.columns[col_idx].tasks.splice(task_idx, 1)
                this.updateDesk(this.getDesk)
                this.finish_task_dialog = this.edit_task_dialog = false
            },
            save(date) {
                this.$refs.menu.save(date)
            },
            save_and_call_api(date) {
                this.$refs.menu.save(date)
                this.apiCall(date.split('-'))
            }
        }
    }
</script>

<style scoped>
    h1 {
        margin-bottom: 50px;
        text-align: left;
    }

    tr {
        cursor: pointer;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
    }

    .list-group-item {
        cursor: move;
    }

    .list-group-item i {
        cursor: pointer;
    }

    .table {
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 0 !important;
        margin-right: 15px;
        position: relative;
    }

    .delete-col {
        position: absolute;
        bottom: -30px;
        right: 0;
        transition: all .3s;
        opacity: 0;
        cursor: pointer;
    }

    .table:hover .delete-col {
        opacity: 1;
    }

    .table thead th {
        text-transform: uppercase;
        font-size: 16px;
    }

    .row {
        margin: 0;
    }

    .buttons__block {
        margin-top: 50px;
    }

    .buttons__block button {
        margin-right: 20px;
    }
</style>