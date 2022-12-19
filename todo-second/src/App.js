import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";




function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [sonuc, setSonuc] = useState(false);
  const [sonucMesaj, setSonucMesaj] = useState("");
  const [duzenlemeVarMi, setDuzenlemeVarMi] = useState(false);
  const [duzenlenecekTodo,setDuzenlenecekTodo] = useState(null);
  const [duzenlenecekTitle,setDuzenleneceTitle] = useState("");

  const todoSil = (id) => {
    axios.delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setSonuc(true)
        setSonucMesaj("Silme işlemi başarılı")
      })
      .catch((error) => {
        setSonuc(true)
        setSonucMesaj("Silme işlemi esnasında bir hata oluştu")
      })
  }

  const changeTodosCompleted = (todo) => {
    console.log(todo)
    const updatedTodo = {
      ...todo,
      completed: !todo.completed
    }
    axios.put(`http://localhost:3004/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setSonuc(true)
        setSonucMesaj("Todo işlemi basarıyla güncellendi")
      })
      .catch((error) => {
        setSonuc(true)
        setSonucMesaj("Todo güncellenirken bir hata oluştu!")
      })

  }



  useEffect(() => {
    axios.get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data)
        setTodolar(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [sonuc])

  const formuDenetle = (event) => {
    event.preventDefault()
    //validation
    if (title === "") {
      alert("Yapılacak iş boş bırakılamaz")
      return
    }
    // create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false
    }

    axios.post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        setTitle("")
        setSonuc(true)
        setSonucMesaj("Kayıt İslemi Basarılı")
      })
      .catch((error) => {
        setSonuc(true)
        setSonucMesaj("Kaydederken bir hata oluştu")
      })
  };

 const todoGuncelleFormunuDenetle=(event)=>{
  event.preventDefault()
  //validation
  if (duzenlenecekTitle=== "") {
    alert("Title boş bırakılamaz")
    return
  }
   // update todo and send server
   const updatedTodo = {
    ...duzenlenecekTodo,
    title: duzenlenecekTitle
  }
  axios.put(`http://localhost:3004/todos/${updatedTodo.id}`, updatedTodo)
      .then((response) => {
        setSonuc(true)
        setSonucMesaj("Guncelleme işlemi basarili")
        setDuzenlemeVarMi(false)
      })
      .catch((error) => {
        setSonuc(true)
        setSonucMesaj("Guncelleme esnasında bir hata oluştu!")
      })

 }


  if (todolar === null) {
    return (null)
  }

  return (
    <div className="container">
      {
        sonuc === true && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0,3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
            zIndex: 1,
          }}>
            <div className="alert alert-warning" role="alert">
              <p>{sonucMesaj}</p>
              <div className="d-flex justify-content-center">
                <button onClick={() => setSonuc(false)}
                  className="btn btn-sm btn-outline-primary">
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )

      }
      <div className="row my-5">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-3">
            <input type="text"
              className="form-control"
              placeholder="Yapılacak işi girin.."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className="btn btn-info"
              type="submit">
              Ekle
            </button>
          </div>
        </form>
      </div>

      {duzenlemeVarMi === true && (
        <div className="row my-5">
          <form onSubmit={todoGuncelleFormunuDenetle}>
            <div className="input-group mb-3">
              <input type="text"
                className="form-control"
                placeholder="Yapılacak işi girin.."
                value={duzenlenecekTitle}
                onChange={(event)=> setDuzenleneceTitle(event.target.value)}
              />
              <button onClick={()=> setDuzenlemeVarMi(false)} className="btn btn-danger"
              >
                Vazgeç
              </button>
              <button className="btn btn-primary"
                type="submit">
                Güncelle
              </button>
            </div>
          </form>
        </div>
      )}
      {todolar.map((todo) => (
        <div key={todo.id} className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <div>
            <h1 style={{
              textDecoration: todo.completed === true ? 'line-through' : 'none',
              color: todo.completed === true ? 'red' : 'black'
            }}>{todo.title}</h1>
            <p>{new Date(todo.date).toLocaleString()}</p>
          </div>
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button onClick={()=>{
                setDuzenlemeVarMi(true)
                setDuzenlenecekTodo(todo)
                setDuzenleneceTitle(todo.title)
              }} 
              type="button" className="btn btn-sm btn-info">
                Düzenle
                <BsPencilSquare size={15} />
              </button>
              <button onClick={() => todoSil(todo.id)} type="button"
                className="btn btn-sm btn-danger">
                Sil
                <BsTrashFill size={15} />

              </button>
              <button onClick={() => changeTodosCompleted(todo)} type="button" className="btn btn-sm btn-primary">
                {todo.completed === true ? "Yapılmadı" : "Yapıldı"}
                <BsFillCheckCircleFill size={15} />
              </button>

            </div>
          </div>
        </div>
      ))
      }
    </div>
  );
}

export default App;
