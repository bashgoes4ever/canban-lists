<template>
    <v-container>
        <h1>Создание новой доски</h1>
        <v-form class="form">
            <v-text-field
                    v-model="title"
                    label="Название доски"
                    required
            ></v-text-field>
            <v-combobox
                    v-model="columns"
                    :items="columns"
                    chips
                    clearable
                    label="Список колонок"
                    multiple
            >
                <template v-slot:selection="{ attrs, item, select, selected }">
                    <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click="select"
                            @click:close="remove(item)"
                    >
                        <strong>{{ item }}</strong>
                    </v-chip>
                </template>
            </v-combobox>
            <v-btn
                    color="primary"
                    :disabled="!title || !columns.length"
                    @click="submit"
            >Создать</v-btn>
        </v-form>
    </v-container>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "AddDesk",
        data: () => ({
            title: '',
            columns: []
        }),
        methods: {
            ...mapActions(['addDesk']),
            submit() {
                const id = + new Date()
                this.addDesk({
                    'title': this.title,
                    'columns': this.columns,
                    id
                })
                this.$router.push(`/desks/${id}`)
            },
            remove(item) {
                this.columns.splice(this.columns.indexOf(item), 1)
                this.columns = [...this.columns]
            },
        },
    }
</script>

<style scoped>
    .form {
        width: 500px;
        margin: 30px auto 0 auto;
    }
</style>