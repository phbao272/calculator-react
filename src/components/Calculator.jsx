import React, { useState, useEffect, useRef } from 'react'
import './calculator.css'

import { BTN_ACTIONS, btns } from './configBtns'

const Calculator = () => {
    const btnsRef = useRef(null)
    const expRef = useRef(null)

    const [expression, setExpression] = useState('')

    useEffect(() => {
        const btns = Array.from(btnsRef.current.querySelectorAll('button'))
        
        btns.forEach(btn => btn.style.height = btn.offsetWidth + 'px')
    }, [])

    const handleBtnClick = (item) => {
        console.log(item)
        const expDiv = expRef.current
        
        switch(item.action) {
            case BTN_ACTIONS.THEME:
                document.body.classList.toggle('dark')
                break
            case BTN_ACTIONS.ADD:
                if (expDiv.parentNode.querySelector('div:last-child').innerText === 'Syntax error') {
                    expDiv.parentNode.querySelector('div:last-child').innerText = ''
                }

                const op = item.display === 'x' ? '*' : item.display
                setExpression(expression + op)
                addAnimSpan(item.display)    
                break
            case BTN_ACTIONS.DELETE: 
                setExpression('')
                expDiv.innerText = ''
                expDiv.parentNode.querySelector('div:last-child').innerText = ''
                break   
            case BTN_ACTIONS.CALC:
                if (expression.trim().length < 0) return null

                const cloneDiv = expDiv.cloneNode(true)
                expDiv.parentNode.querySelector('div:last-child').remove()
                expDiv.parentNode.appendChild(cloneDiv)

                const transform = `translateY(-${cloneDiv.offsetHeight + 10}px) scale(0.4)`

                try {
                    const res = eval(expression)
                    setExpression(res.toString())
                    cloneDiv.style.transform = transform
                    expDiv.innerText = ''
                    addAnimSpan(Math.floor((res * 1000000000) / 1000000000))

                } catch {
                    cloneDiv.style.transform = transform
                    cloneDiv.innerText = 'Syntax error'
                } finally {
                    console.log('finished')
                }
                break
            default:
                throw new Error(`Invalid action ${item.action}`)
        }
    }

    const addAnimSpan = (content) => {
        const expDiv = expRef.current
        const span = document.createElement('span')

        expDiv.appendChild(span)
        span.innerText = content

        const width = span.offsetWidth
        span.style.opacity = '0'
        span.style.width = '0'

        setTimeout(() => {
            span.style.opacity = '1'
            span.style.width = width + 'px' 
        }, 100)
    }

    return (
        <div className="calculator">
            <div className="calculator__result">
                <div ref={expRef} className="calculator__result__exp"></div>
                <div className="calculator__result__exp"></div>
            </div>
            <div ref={btnsRef} className="calculator__btns">
                {
                    btns.map(btn => (
                        <button
                            key={btn.display}
                            className={btn.class}
                            onClick={() => handleBtnClick(btn)}
                        >
                            {btn.display}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Calculator