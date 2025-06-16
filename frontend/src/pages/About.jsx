import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Sobre Nós
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Conheça mais sobre a Barbearia Top e nossa história
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nossa História
                </h2>
                <p className="text-gray-600">
                  A Barbearia Top nasceu da paixão por cortes de cabelo e barba de qualidade.
                  Com mais de 10 anos de experiência, nos dedicamos a oferecer o melhor
                  serviço para nossos clientes, combinando técnicas tradicionais com
                  tendências modernas.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nossa Missão
                </h2>
                <p className="text-gray-600">
                  Proporcionar uma experiência única de cuidado pessoal, com serviços
                  de alta qualidade e atendimento personalizado, sempre respeitando
                  a individualidade de cada cliente.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nossa Equipe
                </h2>
                <p className="text-gray-600">
                  Contamos com uma equipe de profissionais altamente qualificados,
                  constantemente atualizados com as últimas técnicas e tendências
                  do mercado.
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nossos Valores
                </h2>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Excelência no atendimento</li>
                  <li>Qualidade nos serviços</li>
                  <li>Higiene e segurança</li>
                  <li>Inovação constante</li>
                  <li>Respeito ao cliente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 