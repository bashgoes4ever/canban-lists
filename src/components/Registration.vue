<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-on="on" class="button">Регистрация</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">Регистрация</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="ФИО*" v-model="name" required></v-text-field>
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
                                                v-model="date"
                                                label="Дата рождения"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            ref="picker"
                                            v-model="date"
                                            :max="new Date().toISOString().substr(0, 10)"
                                            min="1950-01-01"
                                            @change="save"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Должность*" v-model="job" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Отмена</v-btn>
                    <v-btn color="blue darken-1" text @click="submit" :disabled="!date || !job || !name">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "Registration",
        data: () => ({
            dialog: false,
            date: null,
            name: '',
            job: '',
            menu: false,
        }),
        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
            },
        },
        methods: {
            ...mapActions(['createUser', 'apiCall']),
            submit() {
                this.createUser({
                    name: this.name,
                    job: this.job,
                    birth_date: this.date
                })
                this.dialog = false
            },
            save(date) {
                this.$refs.menu.save(date)
                this.apiCall(this.date.split('-'))
            },
        },
    }
</script>

<style scoped>
    .button {
        width: 90%;
        display: block;
        margin: 0 auto;
    }
</style>