import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { useAlert } from 'react-alert'

import './styles.scss';
import logoImage from '../../assets/logo.png';

import api from './../../services/api';

export default function EditContact() {

  const [contacts, setContacts] = useState();

  let {id} = useParams();

  const username = localStorage.getItem('user');

  const history = useHistory();
  const alert = useAlert();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [phones, setPhoneList] = useState([{ phone: "" }]);
  const [emails, setEmailList] = useState([{ email: "" }]);
  const [addresses, setAddressList] = useState([{ cep: "", street: "", number: "", district: "", city: "", uf: "" }]);

  useEffect(() => {
    api.get(`contacts/${id}`, {
      headers: {
        Authorization: username,
      }
    }).then( 
      response => {
        setName(response.data.contact[0].name);
        setLastname(response.data.contact[0].lastname);
        setPhoneList(response.data.contact[0].phones);
        setEmailList(response.data.contact[0].emails);
        setAddressList([...addresses, { 
          cep: response.data.contact[0].addresses[0].address.cep,
          street: response.data.contact[0].addresses[0].address.street,
          number: response.data.contact[0].addresses[0].address.number,
          district: response.data.contact[0].addresses[0].address.district,
          city: response.data.contact[0].addresses[0].address.city,
          uf: response.data.contact[0].addresses[0].address.uf
        }]);
      }       
    )
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, username]);

  

  //ADRESSESS
  const handleAdressChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...addresses];
    list[index][name] = value;
    setAddressList(list);
  };

  const handleRemoveAddress = index => {
    const list = [...addresses];
    list.splice(index, 1);
    setAddressList(list);
  };

  const handleAddAddress = () => {
    setAddressList([...addresses, { cep: "", street: "", number: "", district: "", city: "", uf: "" }]);
  };

  //PHONE
  const handlePhoneChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...phones];
    list[index][name] = value;
    setPhoneList(list);
  };
  const handleRemovePhone = index => {
    const list = [...phones];
    list.splice(index, 1);
    setPhoneList(list);
  };
  const handleAddPhone = () => {
    setPhoneList([...phones, { phone: "" }]);
  };

  //EMAIL
  const handleEmailChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...emails];
    list[index][name] = value;
    setEmailList(list);
  };
  const handleRemoveEmail = index => {
    const list = [...emails];
    list.splice(index, 1);
    setEmailList(list);
  };
  const handleAddEmail = () => {
    setEmailList([...emails, { email: "" }]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      name,
      lastname,
      phones,
      emails,
      addresses: addresses.map(v => ({"address": v})),
      username: username
    };

    try {
      await api.post('new', data);
      function alertSuccess(){
        alert.success('Cadastro realizado com sucesso!',{
          onClose: () => {
            history.push('/contacts');
          }
        });
      }
      alertSuccess();
    } catch(err){
      alert.error('Erro no cadastro, tente novamente!');
    }

  }

  return (
    <div className="edit-container">
      <div className="content">
        <header>
          <img src={logoImage} alt="KONTAKTO" />
          <Link className="back-link" to="/contacts">
            <FiArrowLeft size={16} color="#00BFA6" />
            Voltar para Contatos
          </Link>
        </header>
        <form onSubmit={handleSubmit}>
          <h3>DADOS PESSOAIS</h3>

          <div className="form-group group-name">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome"
            />
            <input
              value={lastname}
              onChange={e => setLastname(e.target.value)}
              placeholder="Sobrenome"
            />
          </div>

          {phones.map((x, i) => {
            return (
              <div className="form-group group-phone" key={`${x}~${i}`}>
                <input
                  name="phone"
                  placeholder="Telefone"
                  value={x.phone}
                  onChange={e => handlePhoneChange(e, i)}
                />
                <div className="btn-box">
                  {phones.length !== 1 && <button type="button" className="vermelho" onClick={() => handleRemovePhone(i)}><FiMinusCircle /></button>}
                  {phones.length - 1 === i && <button type="button" onClick={handleAddPhone}><FiPlusCircle /></button>}
                </div>
              </div>
            );
          })}

          {emails.map((x, i) => {
            return (
              <div className="form-group group-email" key={`${x}~${i}`}>
                <input
                  name="email"
                  placeholder="E-mail"
                  value={x.email}
                  onChange={e => handleEmailChange(e, i)}
                />
                <div className="btn-box">
                  {emails.length !== 1 && <button type="button" className="vermelho" onClick={() => handleRemoveEmail(i)}><FiMinusCircle /></button>}
                  {emails.length - 1 === i && <button type="button" onClick={handleAddEmail}><FiPlusCircle /></button>}
                </div>
              </div>
            );
          })}
          <h3>ENDEREÇO</h3>
          {addresses.map((address, i) => {
            return (
              <Fragment key={`${address}~${i}`}>
                <div className="form-group" >
                  <div className="group-cep">
                    <input name='cep' value={address.cep} onChange={e => handleAdressChange(e, i)} placeholder="Cep" />
                    <input name='street' value={address.street} onChange={e => handleAdressChange(e, i)} placeholder="Endereço" />
                    <input name='number' value={address.number} onChange={e => handleAdressChange(e, i)} placeholder="Número" />
                  </div>
                  <div className="group-bairro">
                    <input name='district' value={address.district} onChange={e => handleAdressChange(e, i)} placeholder="Bairro" />
                    <input name='city' value={address.city} onChange={e => handleAdressChange(e, i)} placeholder="Cidade" />
                    <input name='uf' value={address.uf} onChange={e => handleAdressChange(e, i)} placeholder="UF" maxLength="2" />
                  </div>
                </div>
                <div className="add-endereco">
                  {addresses.length - 1 === i && <button type="button" onClick={handleAddAddress}><FiPlusCircle /> <span>Adicionar novo endereço</span></button>}
                  {addresses.length !== 1 && <button type="button" className="vermelho" onClick={() => handleRemoveAddress(i)}><FiMinusCircle /> <span>Remover endereço</span></button>}
                </div>
              </Fragment>
            );
          })}
          <button className="button" type="submit">Atualizar</button>
        </form>
      </div >
    </div >
  );
}