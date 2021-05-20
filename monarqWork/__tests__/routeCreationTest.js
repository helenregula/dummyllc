import { routerCreation } from '../mvpRouteCreation.js'
import express from 'express'

describe('routeCreation Function Test', () => {
    const manifest = {
        endpoints: {
            '/working/:id' : {
                get: {
                    operation: 'yes'
                }
            }
        }
    }

    const queryObject = {
        yes: 'This should be returned',
    }

    const executeFn = jest.fn()
    const returned = routerCreation(manifest, queryObject)
   
    beforeAll(() => {
        
    })

    it('should return an express router function', () => {
        expect(typeof returned).toEqual('function')
    })

    it('should have a stack with one element in it', () => {
        expect(returned.stack.length).toEqual(1)
    })

    

})