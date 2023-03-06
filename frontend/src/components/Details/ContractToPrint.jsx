import React from "react";

const ContractToPrint = ({ texte, picturesContract, signature, name }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '50px', marginRight: '50px', height: '842px' }}>
      <div dangerouslySetInnerHTML={{ __html: texte }} style={{ fontSize: '12px', maxWidth: '100%' }} />
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