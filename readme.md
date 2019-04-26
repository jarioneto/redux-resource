# Nextel Baldr
Este projeto é responsável pela integração entre aplicação e servidor para todas as aplicações React
do Pré-Pago. Este módulo foi desenvolvido com react, redux, redux-saga, reselector e axios. Além
disso, o Baldr também expõe um servidor Hapi para rodar uma versão mockada do backend
(nextel-services).

Este projeto expõe os seguintes utilitários para as aplicações que o utilizam:

- Action types: tipos das ações do redux
- Action creators: funções que criam os objetos de ação do redux
- Reducers: reducers para o redux
- Selectors: seletores que providenciam uma versão mais amigável do payload retornado pelo servidor
- Sagas: funções generator que chamam api e alteram o estado. Usadas pelo midleware redux-saga
- APIs: funções que fazem as chamadas de serviço com o Axios
- Stub: servidor Hapi com todas as rotas do backend mockadas

# Instalação
```
yarn add nextel-baldr@git+ssh://git@gitlab.nexteldigital.com.br:ragnarok/baldr.git#<version>
```

Substitua `<version>` pela versão desejada. Exemplo: `1.1`.

# Recursos

Este módulo é dividido em resursos. A definição que seguimos aqui é dos serviços REST, ou seja, todo
recurso pode ser carregado (LOAD), criado (CREATE), atualizado (UPDATE) ou excluído (REMOVE).
Um recurso neste projeto implementa pelo menos uma dessas operações. O recurso
`billing/paymentMethods`, por exemplo, implementa "LOAD" (listar os métodos de pagamento), "CREATE"
(criar um cartão de crédito) e "REMOVE" (excluir cartão de crédito). Por outro lado, o recurso
`lines/chipReplacement` possui apenas uma operação: CREATE (criar requisição de troca de chip).

Todo recurso possui types (tipos de ações), actions (action creators) e sagas. Alguns recursos
também possuem selectors. As ações e reducers de todos os recursos são padronizados e sempre
refletem as operações LOAD, CREATE, UPDATE e REMOVE. Portanto, para todo recurso, é possível
acessar:

```javascript
import { actions } from 'nextel-baldr/lib/módulo/recurso'

actions.load(loadParams) // dispara a ação para carregar o recurso
actions.resetLoadStatus() // reinicializa tudo no recurso correspodente ao LOAD
actions.create(data) // dispara a ação para criar o recurso com o payload descrito em data
actions.resetCreateStatus() // reinicializa tudo no recurso correspodente ao CREATE
actions.update(data) // dispara a ação para atualizar o recurso com o payload descrito em data
actions.resetUpdateStatus() // reinicializa tudo no recurso correspodente ao UPDATE
actions.remove(data) // dispara a ação para remover o recurso com o payload descrito em data
actions.resetRemoveStatus() // reinicializa tudo no recurso correspodente ao REMOVE

const mapStateToProps = (state: ReduxState) => {
  state.modulo.recurso.data // conteúdo retornado no payload
  state.modulo.recurso.loadStatus // estado da operação LOAD. Pode ser null, 'inProgress', 'success' ou 'error'
  state.modulo.recurso.loadError // erro retornado pela operação de LOAD
  state.modulo.recurso.createStatus // estado da operação CREATE. Pode ser null, 'inProgress', 'success' ou 'error'
  state.modulo.recurso.createError // erro retornado pela operação de CREATE
  state.modulo.recurso.updateStatus // estado da operação UPDATE. Pode ser null, 'inProgress', 'success' ou 'error'
  state.modulo.recurso.updateError // erro retornado pela operação de UPDATE
  state.modulo.recurso.removeStatus // estado da operação REMOVE. Pode ser null, 'inProgress', 'success' ou 'error'
  state.modulo.recurso.removeError // erro retornado pela operação de REMOVE
}
```

No código acima, `módulo` e `recurso` devem ser trocados pelo módulo e recurso desejados. Exemplo:
`catalog` e `plans`.

A organização de módulos e recursos seguem o seguinte esquema:

- billing
  - order
  - paymentMethods
  - purchaseHistory
- braze
  - newsfeed
  - user
- catalog
  - addons
  - plans
- consumption
  - extraPackages
  - plan
- faq
  - articles
  - sections
  - search
- lines
  - carriers
  - chipReplacement
  - portability
- user
  - profile

# Utilizando os reducers
No arquivo com seus reducers:

```javascript
import { combineReducers } from 'redux'
import { reducers } from 'nextel-baldr'
import { reducers as myCustomReducer } from './customResource'

const rootReducer = combineReducers({
  billing: combineReducers(reducers.billing),
  catalog: combineReducers(reducers.catalog),
  consumption: combineReducers(reducers.consumption),
  faq: combineReducers(reducers.faq),
  lines: combineReducers(reducers.lines),
  user: combineReducers(reducers.user),
  customResource: myCustomReducer,
})

export default rootReducer
```

No store:

```javascript
import reducers from './reducers'

...

const store = createStore(reducers, myMiddlewares)
```

# Utilizando os sagas

No arquivo de sagas:

```javascript
import { sagas as paymentMethods } from 'nextel-baldr/lib/store/billing/paymentMethods'
import { sagas as purchaseHistory } from 'nextel-baldr/lib/store/billing/purchaseHistory'
import { sagas as addons } from 'nextel-baldr/lib/store/catalog/addons'
import { sagas as plans } from 'nextel-baldr/lib/store/catalog/plans'
import { sagas as extraPackages } from 'nextel-baldr/lib/store/consumption/extraPackages'
import { sagas as plan } from 'nextel-baldr/lib/store/consumption/plan'
import { sagas as articles } from 'nextel-baldr/lib/store/faq/articles'
import { sagas as search } from 'nextel-baldr/lib/store/faq/search'
import { sagas as sections } from 'nextel-baldr/lib/store/faq/sections'
import { sagas as carriers } from 'nextel-baldr/lib/store/lines/carriers'
import { sagas as portability } from 'nextel-baldr/lib/store/lines/portability'
import { sagas as chipReplacement } from 'nextel-baldr/lib/store/lines/chipReplacement'
import { sagas as profile } from 'nextel-baldr/lib/store/user/profile'
import { createEffects } from 'nextel-baldr/lib/utils/sagas'
import { sagas as myCustomSaga } from './customResource'

const rootSaga = function* run() {
  yield createEffects({
    ...paymentMethods,
    ...purchaseHistory,
    ...addons,
    ...plans,
    ...extraPackages,
    ...plan,
    ...articles,
    ...search,
    ...sections,
    ...carriers,
    ...portability,
    ...chipReplacement,
    ...profile,
    ...myCustomSaga,
  })
}
```

No store:

```javascript
import sagas from './sagas'
import createSagaMiddleware from 'redux-saga'

...

const sagaMiddleware = createSagaMiddleware()

...

sagaMiddleware.run(sagas)
```

# Criando recursos customizados

Nas seçôes anteriores, um dos reducers importados é `myCustomReducer` e um dos sagas é
`myCustomSaga`. É provável que os recursos do Baldr não sejam suficientes para a aplicação, fazendo
necessária a criação de novos recursos. Para isso, esta biblioteca oferece os seguintes utilitários:
`createResourceReducer`, `createResourceActions` e `createResourceSagas`. Veja um exemplo de como
utilizá-los considerando o recurso fictício "Addresses".

```javascript
import { createResourceActions } from 'nextel-baldr/lib/utils/actions'
import { createResourceReducer } from 'nextel-baldr/lib/utils/reducers'
import { createResourceSagas } from 'nextel-baldr/lib/utils/sagas'
import AddressesProvider from 'api/addresses'

const { types, actions } = createResourceActions('ADDRESSES') // create actions with the namespace ADDRESSES
const reducer = createResourceReducer(types) // create the reducer for the new resource
// create the sagas for the operations LOAD, CREATE and REMOVE.
const sagas = createResourceSagas(actions, types, {
  load: AddressesProvider.fetchAllAddresses,
  create: AddressesProvider.createAddress,
  remove: AddressesProvider.removeAddress
})

export {
  types,
  actions,
  reducer,
  sagas,
}

```

# Types, action creators e selectors

Para usar types, action creators and selectors, importe-os diretamente de
`nextel-baldr/lib/store/{módulo}/{recurso}`.

Exemplo de utilização de um action creator e selector do catálogo de addons:

```javascript
import { actions, selectors } from 'nextel-baldr/lib/catalog/addons'
import { connect } from 'react-redux'

...

const mapStateToProps = state => ({
  rechargeValues: { ...state.catalog.addons, data: selectors.selectRechargeValues(state) },
})

export default connect(mapStateToProps, { loadAddons: actions.load })(MyComponent)
```

No exemplo acima, utilizamos a ação de carregar o catálogo de addons. Mas, o payload retornado
por essa request possui tanto pacotes extras quanto valres de recarga. Neste componente específico,
precisamos apenas dos valores de recarga formatdos, que são obitidos através do seletor
`selectRechargeValues`.

# Tipos do Flow

Todo recurso possui um tipo que é exportado no arquivo `types/resources`. Um recurso genérico é
definido pelo tipo `Resource` e deve ser especificado através do uso de generics. Por exemplo, um
recurso de consumo de plano deve ser do tipo `Resource<Plan>`.

O estado do redux é representado pelo tipo `ReduxState`, também em `types/resources`.

Se um recurso é transformado através de um selector, o tipo retornado pelo seletor pode ser
encontrado em `types/selectors`.

Veja o código abaixo correspondente à Home do pré-pago web:

```javascript
// @flow

...
import { actions as userPlanActions, selectors as userPlanSelectors } from 'nextel-baldr/lib/store/consumption/plan'
import { actions as userPackageActions, selectors as userPackageSelectors } from 'nextel-baldr/lib/store/consumption/extraPackages'
import { actions as paymentMethodsActions } from 'nextel-baldr/lib/store/billing/paymentMethods'
import type { Resource, PaymentMethods, ReduxState } from 'nextel-baldr/lib/types/resources'
import type { Plan, ExtraPackage } from 'nextel-baldr/lib/types/selectors'

type Props = {
  plan: Resource<Plan>,
  paymentMethods: Resource<PaymentMethods>,
  packages: Resource<Array<ExtraPackage>>,
  loadPaymentMethods: Function,
  loadPlan: Function,
  loadExtraPackages: Function,
}

class Home extends PureComponent<Props> {
  ...
}

const mapStateToProps = (state: ReduxState) => ({
  paymentMethods: { ...state.billing.paymentMethods },
  plan: {
    ...state.consumption.plan,
    data: userPlanSelectors.selectConsumption(state),
  },
  packages: {
    ...state.consumption.extraPackages,
    data: userPackageSelectors.selectConsumption(state),
  },
})

const actions = {
  loadPlan: userPlanActions.load,
  loadExtraPackages: userPackageActions.load,
  loadPaymentMethods: paymentMethodsActions.load,
}

export default connect(mapStateToProps, actions)(Home)
```
