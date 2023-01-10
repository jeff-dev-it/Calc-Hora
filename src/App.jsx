import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [valor_por_hora, setValorPorHora] = useState(0)
  const [valor_por_min, setValorPorMin] = useState(0)
  const [valor_total, setValorTotal] = useState(0)
  const [rodando, setRodando] = useState(false)
  const [pausado, setPause] = useState(false)
  const [histórico, setHistórico] = useState([])
  const [minutos_rodado, setMinutosRodado] = useState(0)
  const [time, setTime] = useState(undefined)

  useEffect(()=>{
    setValorPorMin(valor_por_hora / 60);
  }, [valor_por_hora])

  useEffect(()=>{
    if(rodando && !pausado){
      setTime(setTimeout(()=>{
        let time_run = minutos_rodado + 1;
        setMinutosRodado(time_run);

        setValorTotal(parseFloat(valor_por_min) * time_run)

        clearTimeout(time)
      }, 1000 * 60))

    }else if(time){
      clearTimeout(time)
    }

  }, [rodando, pausado, minutos_rodado])


  return (
    <div className="card">
        <h1>Calcule a hora</h1>
        <div className='in-line'>
          <div className='input'>
            <input
              readOnly={rodando}
              onChange={(e)=>{
                setValorPorHora(e.target.value);
              }}
              type={"number"} min={"0"} placeholder="Valor que você recebe"/>
            <p>/hora</p>
          </div>
          <div className='control'>
            <p>Valor p/ minuto: {parseFloat(valor_por_min).toFixed(2)}R$/min | Tempo passado: {minutos_rodado} min</p>
            <h2 className='valor-receber'>{parseFloat(valor_total).toFixed(2)}R$</h2>
              {
                rodando? (
                  <>
                    <button onClick={()=> setPause(!pausado)} className='pause'>{pausado? "Retomar": "Pausar"}</button>
                    <button onClick={()=>{
                      setRodando(false)
                      setHistórico([...histórico, {
                        minutos_rodado,
                        valor_por_min,
                        valor_por_hora,
                        valor_total,
                        data: Date.now()
                      }])

                      setMinutosRodado(0)
                      setValorTotal(0)
                      setPause(false)
                    }}  className='stop'>Parar</button>
                  </>
                ): <button onClick={()=> setRodando(true)} className='start'>Iniciar</button>
              }

          </div>
          <div>
            <h3>Histórico</h3>
            <p>Minutos trabalhados | Valor por hora | Valor por minuto | Total | Data</p>
            {
              histórico.map(({minutos_rodado, valor_por_min, data, valor_por_hora, valor_total})=>{
                return (
                    <div key={`${(Math.random()*199).toString(16)}`}>
                      <p>{minutos_rodado} minuto/s | {parseFloat(valor_por_hora).toFixed(2)}R$/h | {parseFloat(valor_por_min).toFixed(2)}R$/min | {parseFloat(valor_total).toFixed(2)}R$| {new Date(data).toLocaleString("pt-br")}</p>
                    </div>
                  )
              })
            }
          </div>
        </div>
    </div>
  )
}

export default App
