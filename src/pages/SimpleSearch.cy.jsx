import React from 'react'
import SimpleSearch from './SimpleSearch'

describe('<SimpleSearch />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SimpleSearch />)
  })
})