import React, { useEffect, useState, useRef } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Card, Steps, Button, message, notification } from 'antd';
import { RegisterForm, ThemeSelection, SignupSuccess } from './';

const { Step } = Steps;

export default function Signup() {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState({});
  const registerRef = useRef(null);
  const themeRef = useRef(null);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Remplissez vos informations personnelles',
      content: <RegisterForm ref={registerRef} values={values} />,
    },
    {
      title: 'Trouvez des thèmes qui vous intéressent',
      content: <ThemeSelection ref={themeRef} />,
    },
    {
      title: 'Terminé',
      content: <SignupSuccess />,
    },
  ];

  const goNext = () => {
    if (current === 0) {
      registerRef.current && registerRef.current.validateFields().then((values) => {
        setValues(values);
        next();
      }).catch(() => {
        notification.error({
          message: 'Error',
          description:
            'Veuillez remplir si nécessaire.'
        })
      });
    } else {
      if (current === 1) {
        console.log(values, themeRef.current && themeRef.current.selectedTags);
      }
      next();
    }
  };

  return (
    <div className="home-signup">
      <Card title="S'inscrire">
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => goNext(current)}
            >
              {current === 0 ? "Suivant" : "S'inscrire"}
            </Button>
          )}
          {current > 0 && current < steps.length - 1 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Précédent
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

Signup.propTypes = {};
Signup.defaultProps = {};
