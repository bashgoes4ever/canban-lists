<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <router-link to="/" class="v-list-item v-list-item--link theme--light" link>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Главная</v-list-item-title>
                    </v-list-item-content>
                </router-link>
                <router-link to="/add" class="v-list-item v-list-item--link theme--light" link>
                    <v-list-item-action>
                        <v-icon>mdi-plus</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Создать новую доску</v-list-item-title>
                    </v-list-item-content>
                </router-link>
            </v-list>
            <Registration v-if="!user" />
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title v-if="user" class="thin-text">{{user.name}}, {{user.job}}</v-toolbar-title>
        </v-app-bar>

        <v-content class="content">
            <router-view></router-view>
        </v-content>

        <v-footer color="indigo" app>
            <span class="white--text">&copy; 2020</span>
        </v-footer>

        <v-snackbar
                v-model="snackbar.open"
                :color="snackbar.color"
                :multi-line="true"
                :right="true"
                :top="true"
                :timeout="5000"
        >
            {{ snackbar.text }}
            <v-btn
                    dark
                    text
                    @click="snackbar.open = false"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Registration from '@/components/Registration'

    export default {
        props: {
            source: String,
        },
        components: {Registration},
        computed: mapGetters(['user', 'snackbar']),
        data: () => ({
            drawer: null
        }),
    }
</script>

<style>
    a {
        text-decoration: none;
        color: inherit;
    }

    .thin-text {
        font-weight: 300;
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    h1 {
        text-align: center;
    }
    .container {
        padding-top: 50px;
    }
</style>