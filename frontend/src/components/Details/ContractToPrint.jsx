import React from "react";

const ContractToPrint = ({ texte, picturesContract, signature, name }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px'}}>
      <div dangerouslySetInnerHTML={{ __html: texte }} />
      <div>
        {picturesContract && picturesContract.map((item, index) => (
          <img style={{ maxWidth: '150px' }} key={index} src={item} alt="EDL" className="pictures-edl" />
        ))}
      </div>
      <div>
        {name && <p style={{ fontSize: '12px' }}> Signature : {name}</p>}
        {signature && (
          <img style={{ maxWidth: '250px' }} src={signature} alt="Signature" />
        )}
      </div>
    </div>
  );
};

export default ContractToPrint;