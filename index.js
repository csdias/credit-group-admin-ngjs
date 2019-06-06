import './style.css';
import angular from 'angular';
import ngRoute from 'angular-route';

var app = angular.module("myApp", [ngRoute]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            template: "<lista-container></lista-container>"
        })
    $routeProvider
        .when("/cpfs/:id", {
            template: "<cpf-container></cpf-container>"
        })
        .when("/parametros", {
            template: "<div>Parâmetros</div>"
        })
        .when("/relatorio", {
            template: "<div>Relatório</div>"
        });
});
app.directive('manager', function () {
    return {
        restrict: 'E',
        controller: function ManagerController($scope, $route) {

            $scope.permissoes = [{}, {}]; //usar o globalService para obter as permissoes

            this.obterPermissoes = function () { return $scope.permissoes };

        },
    };
});
app.directive('listaContainer', function () {
    return {
        template: `<input type="text" placeholder="Digite o cpf" ng-model="omniSearch"></input><button><i class="icon ion-md-search" title="Pesquisa por Cpf" ></i></button>
<br><br>
<div style="padding-bottom:3px"><button class="btn-success" data-toggle="modal" data-target="#modalLista" title="Novo grupo">NOVO GRUPO  <i class="icon ion-md-add-circle-outline" title="Novo grupo" ></i></button></div>

<lista ng-repeat="lista in listas" param="{ lista: lista, omni: omniSearch }"></lista>

<!-- Modal Lista-->
<div class="modal fade" id="modalLista" tabindex="-1" role="dialog" aria-labelledby="modalListaLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalListaLabel">Incluir/Alterar Lista</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            Grupo: <input type="text" ng-model="listaSelecionada.descricao"></input>
            Política: <input type="text" ng-model="listaSelecionada.politica"></input>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</div>
`,
        require: '^manager',
        controller: ['$scope', '$window', '$route', '$routeParams', function ($scope, $window, $route, $routeParams) {

            $scope.listas = [{ codigo: 1, descricao: "Geral", politica: "politica_geral" }, { codigo: 2, descricao: "Funcionários", politica: "politica_funcionario" }, { codigo: 3, descricao: "Ricos", politica: "politica_ricos" }, { codigo: 4, descricao: "Famosos", politica: "politica_famosos" }];

            //$scope.listas = $scope.listasOriginais;
            //$scope.$watch('omniSearch', function () {
            //if ($scope.omniSearch)
            //$scope.listas = $scope.listasOriginais.filter((lista) => lista.politica.indexOf($scope.omniSearch) > 0);
            //else
            //$scope.listas = $scope.listasOriginais;
            //});


            this.selecionarLista = function (lista) {
                $scope.listaSelecionada = lista;
            };

            this.apresentarCpfs = function (lista) {
                $window.location.href = "#!cpfs" + "/" + lista.codigo;
            }

        }],
        link: function (scope, element, attrs, parentCtrl) {

            scope.permissoes = parentCtrl.obterPermissoes();

        },
    };
});
app.directive('lista', function () {
    return {
        restrict: 'EA',
        require: '^lista-container',
        template: `<div class="card" ng-show="deveApresentarCard">
  <div class="card-header"><div class="row"><div class="col-md-11">Grupo: <strong>{{obj.lista.descricao }}</strong></div><div class="col-md-1"><i data-toggle="modal" data-target="#modalLista" ng-click="selecionarLista(obj.lista)" class="icon ion-md-create" title="Alterar lista {{obj.lista.descricao}}" ></i> <i class="icon ion-md-close-circle" title="Desativar lista {{obj.lista.descricao}}" ></i>&nbsp;&nbsp;<i class="icon ion-md-arrow-dropup" title="Minimizar lista {{obj.lista.descricao}}" ></i></div></div>


  </div>
  <div class="card-body">
<div class="row"><div class="col-md-8"><h5 class="card-title">{{ obj.lista.politica }}</h5></div><div class="col-md-4"><small><small>Criação <strong>21/05/2018</small></small></strong>&nbsp;&nbsp;&nbsp;<small><small>Expiração <strong>21/05/2019</small></small></strong></div></div>
    
    <p class="card-text">Regras:  <small>Não validar a idade</small>
<small>Não validar a cidade</small></p>

<div class="row" style="padding-bottom:3px"><div class="col-md-2"><button class="btn-success" title="Novo Cpf para a lista {{obj.lista.descricao}}">NOVO CPF  <i class="icon ion-md-add-circle-outline" title="Novo Cpf" ></i></button></div><div class="col-md-9"><button class="btn-primary" title="Importar Cpf´s para a lista {{obj.lista.descricao}}">IMPORTAR CPFS  <i class="icon ion-md-add-circle-outline" title="Importar Cpf´s" ></i></button></div></div>

<cpf-container param="obj"></cpf-container>
  </div>
</div>
<!--<button type="button" class="btn btn-primary" ng-click="apresentarCpfs(obj.lista)">
  Cpf´s 
</button>--><br>
`,
        scope: {
            obj: '=param'
        },
        controller: ['$scope', function ($scope) {

            $scope.deveApresentarCard = true;

            this.apresentarCard = function (deveApresentar) {
                $scope.deveApresentarCard = deveApresentar;
            }

        }],
        link: function (scope, element, attrs, parentCtrl) {

            scope.selecionarLista = function (lista) {
                parentCtrl.selecionarLista(lista);
            };

            scope.apresentarCpfs = function (lista) {
                parentCtrl.apresentarCpfs(lista);
            }
        },
    }
});
app.directive('cpfContainer', function () {
    return {
        require: '^lista',
        restrict: 'EA',
        template: `<cpf ng-repeat="cpf in cpfs" param="cpf"></cpf>`,
        scope: {
            param: '=param'
        },
        controller: ['$scope', '$routeParams', 'filterFilter', function ($scope, $routeParams, filterFilter) {

            $scope.cpfsOriginais = [{ listaRiscoCodigo: 1, cpf: "111111", situacao: "A" }, { listaRiscoCodigo: 1, cpf: "1213423231", situacao: "A" }, { listaRiscoCodigo: 2, cpf: "22222", situacao: "D" }, { listaRiscoCodigo: 2, cpf: "55555555", situacao: "A" }, { listaRiscoCodigo: 3, cpf: "3131313", situacao: "A" }, { listaRiscoCodigo: 3, cpf: "3331231", situacao: "A" }, { listaRiscoCodigo: 4, cpf: "44422222", situacao: "D" }, { listaRiscoCodigo: 4, cpf: "444555", situacao: "A" }];

            $scope.filterFilter = filterFilter;

            //Rra no container mas mudou para dentro do cpf
            //this.selecionarCpf = function (cpf) {
            //    $scope.cpfSelecionado = cpf;
            //};          

        }],
        link: function (scope, element, attrs, parentCtrl) {

            scope.$watch('param.omni', function () {

                scope.cpfs = scope.filterFilter(scope.cpfsOriginais, { listaRiscoCodigo: scope.param.lista.codigo, cpf: scope.param.omni });

                if (scope.cpfs.length == 0)
                    parentCtrl.apresentarCard(false);
                else
                    parentCtrl.apresentarCard(true);

            });

        },
    };
}).directive('cpf', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        require: '^cpf-container',
        template: `

<div class="list-group-item list-group-item-action">
<div class="row"><div class="col-md-11">Cpf: <strong>{{ cpf.cpf }}</strong> &nbsp;&nbsp;&nbsp;&nbsp;<small><small>Criação: <strong>21/05/2011</strong> &nbsp;&nbsp;&nbsp; Expiração: <strong>23/05/2014</strong></small></small></div><div class="col-md-1"><i data-toggle="modal" data-target="#modalCpf-{{cpf.cpf}}" ng-click="selecionarCpf(cpf)" class="icon ion-md-create" title="Alterar Cpf {{cpf.cpf}}" ></i> <i class="icon ion-md-close-circle" title="Desativar Cpf {{cpf.cpf}}" ></i></div></div>

</div>


<!-- Modal Cpf-->
<div class="modal fade" id="modalCpf-{{cpf.cpf}}"  tabindex="-1" role="dialog" aria-labelledby="modalCpfLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCpfLabel">Incluir/Alterar Cpf</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            Cpf: <input type="text" ng-model="cpfSelecionado.cpf"></input>
            Data de Expiração: <input type="text"></input>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</div>
`,
        scope: {
            cpf: '=param'
        },
        controller: ['$scope', function ($scope) {

        }],

        link: function (scope, element, attrs, parentCtrl) {

            scope.selecionarCpf = function (cpf) {

                //vinha do parente, mas fui obrigado a mudar a estrutura
                //parentCtrl.selecionarCpf(cpf);
                scope.cpfSelecionado = cpf;
            };

        },
    }
});

