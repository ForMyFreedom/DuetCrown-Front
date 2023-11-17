import { useState } from 'react';
import './Roll.css'

const dices = [4, 6, 10, 20, 100]

const Roll = () => {
  const [amount, setAmount] = useState<number[]>(Array(dices.length).fill(1))
  const [result, setResult] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [cifraAmount, setCifraAmount] = useState<number>(1)

  const rollDice = (dice: number, quant: number) => {
    if(!quant) { return }
    let result = 0

    for(let i = 0; i < quant; i++) {
      result += Math.floor(Math.random() * dice) + 1
    }

    setResult(String(result))
    setShowModal(true)
  }

  const rollCifra = () => {
    if(!cifraAmount) { return }
    let result = ''
    const options = ['👑', '⚜️']
    
    for(let i = 0; i < cifraAmount; i++) {
      result += options[Math.floor(Math.random() * options.length)]
    }

    setResult(result)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="full-box">
      <div className="list-atr">
        <h2 key='list-heading' className="list-heading">Rolagem</h2>
        <div className='roll-grid'>
          {dices.map((dice, index) => (
            <div key={dice} className='roll-dice'>
              <div style={{display: 'flex'}}>
                <input value={amount[index] || 1}
                  onChange={(event => setAmount(oldAmount => {
                    const newAmount = [...oldAmount]
                    newAmount[index] = Number(event.target.value)
                    return newAmount
                  }))}
                  className='roll-input'
                />
                <h3>d{dice}</h3>
              </div>
              <button onClick={()=>rollDice(dice, amount[index])}>Rolar</button>
            </div>
          ))}
          <div key='cifra' className='roll-dice'>
            <div style={{display: 'flex'}}>
                <input value={cifraAmount}
                  onChange={(event) => setCifraAmount(Number(event.target.value))}
                  className='roll-input'
                />
                <h3>Cifra</h3>
            </div>
            <button onClick={rollCifra}>Rolar</button>
          </div>
        </div>
        <p className='topic--vantage-explanation'>
          Jogar Cifras de Vantagem:
        </p>
        <p className='text--vantage-explanation'>
          Para cada Coroa [👑], suba seu resultado (Falha -&gt; Sucesso Parcial -&gt; Sucesso Total)
        </p>
        <p className='topic--vantage-explanation'>
          Jogar Cifras de Desvantagem:
        </p>
        <p className='text--vantage-explanation end--vantage-explanation'>
          Para cada Revez [⚜️], desça seu resultado (Sucesso Total -&gt; Sucesso Parcial -&gt; Falha)
        </p>
      </div>
      {showModal && (
        <div onClick={closeModal} className="modal">
          <div className="modal-content roll-modal">
            <h2>Resultado:</h2>
            <h3>{result}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roll;