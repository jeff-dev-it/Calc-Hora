import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [valor_por_minuto, setValorPorMinuto] = useState(0)
  const [valor_final, setValorFinal] = useState(0)
  const [rodando, setRodando] = useState(false)
  const [pausada, setPausada] = useState(false)
  const [minutos_rodados, setMinutosRodados] = useState(0)
  const [histórico, setHistórico] = useState(JSON.parse(localStorage["history"]) || [])
  const [time, setTime] = useState(undefined);
  const fomatador_real = Intl.NumberFormat("pt-br", {
    currency: "BRL",
    style: "currency"
  })

  useEffect(()=>{

    if(rodando && !pausada){
      setTime(setTimeout(()=>{
        let minutos = minutos_rodados + 1;
        setMinutosRodados(minutos)

        setValorFinal(Number(parseFloat(valor_por_minuto * minutos).toFixed(2)))
        
        clearTimeout(time)
      }, 1000 * 60))
    }

  }, [rodando, pausada, minutos_rodados])
  
  useEffect(()=>{
    localStorage["history"] = JSON.stringify(histórico)
  }, [histórico])

  return (
    <div className="card">
        <h1>Calcule a hora</h1>
        <div className='in-line'>
          <div className='input'>
            <input
              onChange={({target})=>{
                if(target.value){
                  setValorPorMinuto(Number(parseFloat(target.value / 60).toFixed(2)))
                }
              }}
              type={"number"} min={"0"} placeholder="Valor que você recebe"/>
            <p>/hora</p>
          </div>
          <div className='control'>
            <p>Valor p/ minuto: {valor_por_minuto}R$/min | Tempo passado: {minutos_rodados} min</p>
            <h2 className='valor-receber'>{valor_final}R$</h2>
            
            {
              rodando? <>
                <button onClick={()=> setPausada(!pausada)} className='pause'>{pausada? "Retomar": "Pausar"}</button>
                <button onClick={()=>{
                    setRodando(false)
                    setPausada(false)

                    const para_histórico = {
                      minutos_rodados, 
                      valor_por_minuto, 
                      valor_final,
                      data: Date.now(),
                      valor_por_hora: valor_por_minuto * 60
                    }

                    setHistórico([para_histórico, ...histórico])
                    setMinutosRodados(0)
                    setValorFinal(0)
                }} className='stop'>Parar</button>
              </>: <button onClick={()=>{
                if(valor_por_minuto) setRodando(true)
                else alert("Adicione o valor a ser contabilizado.")
              }} className='start'>Iniciar</button>
            }
            
            


          </div>
          <div>
            <h3>Histórico</h3>
            <p>Minutos trabalhados | Valor por hora | Valor por minuto | Total | Data</p>
            {
              histórico.map(({minutos_rodados, valor_por_hora, valor_por_minuto, valor_final, data})=>{
                return (
                  <div key={(Math.random() * 100).toString(16)}>
                    <p>
                      {minutos_rodados} | {fomatador_real.format(valor_por_hora)} | {fomatador_real.format(valor_por_minuto)} | {fomatador_real.format(valor_final)} | {new Date(data).toLocaleString("pt-br")}
                    </p>
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