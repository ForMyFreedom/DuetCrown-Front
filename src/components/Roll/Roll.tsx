import { useState } from 'react';
import './Roll.css'

const dices = [4, 6, 8, 10, 20, 100]

const Roll = () => {
  const [amount, setAmount] = useState<number[]>(Array(dices.length).fill(1))
  const [result, setResult] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)

  const rollDice = (dice: number, index: number) => {
    const quant = amount[index]
    let result = 0

    if(!quant) {
      return
    }

    for(let i = 0; i < quant; i++) {
      result += Math.floor(Math.random() * dice) + 1
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
                className='roll-input'/>
                <h3>d{dice}</h3>
              </div>
              <button onClick={()=>rollDice(dice, index)}>Rolar</button>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div onClick={closeModal} className="modal">
          <div className="modal-content roll-modal">
            <h2>Resultado: {result}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roll;