import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { getCreditos, crearCredito } from "../services/api_credito";

<<<<<<< HEAD
const Gestion = () => {
  const navigate = useNavigate();

  // Estados principales
  const [menuOpen, setMenuOpen] = useState(true);
  const [personasAprobadas, setPersonasAprobadas] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");

  const tasaEuroBCV = 104.51;
  const [fechaDesde, setFechaDesde] = useState(new Date()); // Fecha inicio
  const [fechaHasta, setFechaHasta] = useState(null); // Fecha fin (18 semanas después)

  const [creditoData, setCreditoData] = useState({
    aprobacion_id: null,
    cedula_credito: "",
    referencia: "",
    monto_euros: "",
    monto_bs: "",
    diez_euros: "",
    fecha_desde: "",
    fecha_hasta: "",
    contrato: "",
    estatus: "Pendiente",
    detalles: {
      emprendimiento: "",
      requerimientos: "",
    },
  });

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // Cargar créditos al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCreditos = await getCreditos();
        setPersonasAprobadas(dataCreditos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Filtrar solicitudes únicas por cédula
  const solicitudesPorCedula = personasAprobadas.reduce((acc, solicitud) => {
    if (!acc[solicitud.cedula]) {
      acc[solicitud.cedula] = solicitud;
    }
    return acc;
  }, {});
  const solicitudesUnicas = Object.values(solicitudesPorCedula);

  // Función para mostrar detalles con Swal
  const handleVerDetalles = (s) => {
    Swal.fire({
      title: `${s.nombre_apellido}`,
      html: `
      <div class="font-serif text-sm text-gray-800 space-y-4">
        <div>
          <p class="mb-2"><strong>Número de contrato:</strong> ${s.contrato}</p>
          <p class="mb-2"><strong>Estado:</strong> ${s.estatus}</p>
        </div>
        <h3 class="font-semibold text-lg mb-3 border-b border-gray-300 pb-2">Historial de depósitos</h3>
        <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200 table-auto">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th class="px-4 py-2 border-b border-gray-200">Euros</th>
                <th class="px-4 py-2 border-b border-gray-200">Bs</th>
                <th class="px-4 py-2 border-b border-gray-200">Fecha</th>
                <th class="px-4 py-2 border-b border-gray-200">Referencia</th>
                <th class="px-4 py-2 border-b border-gray-200">Estatus</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 text-sm text-gray-800">
              ${personasAprobadas
                .filter((p) => p.cedula === s.cedula)
                .map(
                  (dep, index) => `
                <tr class="${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition">
                  <td class="px-4 py-2 border-b border-gray-200 text-center">${
                    dep.monto_euros
                  }</td>
                  <td class="px-4 py-2 border-b border-gray-200 text-center">${
                    dep.monto_bs
                  }</td>
                  <td class="px-4 py-2 border-b border-gray-200 text-center">${
                    dep.fecha_desde
                  } / ${dep.fecha_hasta}</td>
                  <td class="px-4 py-2 border-b border-gray-200 text-center">${
                    dep.referencia
                  }</td>
                  <td class="px-4 py-2 border-b border-gray-200 text-center">${
                    dep.estatus
                  }</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "max-w-4xl p-6 rounded-lg shadow-lg",
      },
    });
  };

  // Función para depositar con Swal y cálculos
  const handleDepositarSwal = async (s) => {
    setSolicitudSeleccionada(s);
    // Setear fechas
    setFechaDesde(new Date());
    const fechaH = new Date();
    fechaH.setDate(fechaH.getDate() + 18 * 7); // 18 semanas
    setFechaHasta(fechaH);

    // Input monto en euros
    const { value: montoStr } = await Swal.fire({
      title: "Ingresa monto en euros",
      input: "number",
      inputLabel: "Monto en euros",
      inputPlaceholder: "Ejemplo: 100",
      inputAttributes: {
        min: 0,
        step: 0.01,
      },
      showCancelButton: true,
    });
    if (montoStr === undefined) return; // Cancelado
    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) {
      Swal.fire(
        "Monto inválido",
        "Ingresa un monto válido mayor a cero.",
        "error"
      );
      return;
    }

    // Input referencia bancaria
    const { value: referencia } = await Swal.fire({
      title: "Referencia bancaria (últ 5 dígitos)",
      input: "text",
      inputPlaceholder: "Ejemplo: 12345",
      inputAttributes: {
        maxlength: 5,
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!/^\d{5}$/.test(value)) {
          return "Debe tener exactamente 5 dígitos numéricos.";
        }
      },
    });
    if (referencia === undefined) return;

    // Cálculos
    const montoEuros = monto.toFixed(2);
const montoBs = (monto * tasaEuroBCV).toFixed(2);
const diezEuros = (monto * 0.1).toFixed(2);

// Convertir cadenas a números antes de sumar
const montoEurosNum = parseFloat(montoEuros);
const diezEurosNum = parseFloat(diezEuros);

// Sumar para obtener montoDevolverEuros
const montoDevolverEuros = (montoEurosNum + diezEurosNum).toFixed(2);

// Dividir montoDevolverEuros entre 18
const montoCancelarEuros = (parseFloat(montoDevolverEuros) / 18).toFixed(2);

    // Confirmar depósito
    const confirmResult = await Swal.fire({
      title: "Confirmar depósito",
      html: `
        <p>Montos a depositar:</p>
        <ul style="list-style:none;padding:0;">
          <li>Euros: € ${montoEuros}</li>
          <li>Bs: Bs ${montoBs}</li>
        </ul>
        <p><strong>Fecha Desde:</strong> ${fechaDesde.toLocaleDateString()}</p>
        <p><strong>Fecha Hasta (18 semanas):</strong> ${fechaHasta.toLocaleDateString()}</p>
        <p><strong>Referencia:</strong> ${referencia}</p>
        <p><strong>Calculos:</strong></p>
        <ul style="list-style:none;padding:0;">
          <li>Euros / 18: € ${montoCancelarEuros}</li>
          <li>10% del monto: € ${(monto * 0.1).toFixed(2)}</li>
          <li>Monto a devolver: € ${montoDevolverEuros}</li>
        </ul>
      `,
      showCancelButton: true,
      confirmButtonText: "Depositar",
    });
    if (confirmResult.isConfirmed) {
      // Enviar datos
      // Dentro de handleDepositarSwal, justo antes de llamar a enviarDeposito
      const depositoData = {
        cedula_credito: s.cedula,
        referencia,
        monto_euros: montoEuros,
        monto_bs: montoBs,
        diez_euros: diezEuros,
        fecha_desde: fechaDesde.toISOString().slice(0, 10),
        fecha_hasta: fechaHasta ? fechaHasta.toISOString().slice(0, 10) : null,
        estatus: creditoData.estatus,
        cuota: montoDevolverEuros,
      };

      await enviarDeposito(depositoData);
      setMensajeExito(`Has depositado ${montoEuros} € (Bs.${montoBs})`);
=======
const gestionContratos = ({ setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [contratos, setContratos] = useState([]);
  const [user, setUserState] = useState(null);

  // Estado para depósito
  const [montoDeposito, setMontoDeposito] = useState("");
  const [referenciaDeposito, setReferenciaDeposito] = useState('');
  const [fechaDeposito, setFechaDeposito] = useState('');
  const [mostrarModalDeposito, setMostrarModalDeposito] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  // Estado para registrar nuevo contrato
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoContrato, setNuevoContrato] = useState({
    cedula: "",
    nombre_apellido: "",
    contrato: "",
    estatus: "Pendiente",
    fecha_inicio: "",
    fecha_final: "",
    monto_total: "",
    referencia: "",
    cuenta_bancaria: {
      banco: "",
      numero_cuenta: "",
      titular: "",
    },
  });

  // Para listado y gestión de contratos por cédula
  const [listaContratos, setListaContratos] = useState([]);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  // Toggle menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Datos simulados y carga en localStorage
  const datosSimuladosContratos = [
    {
      cedula: "12345678",
      nombre_apellido: "Juan Pérez",
      contrato: "ifemi-001-25",
      estatus: "Aceptado",
      fecha_inicio: "2024-01-01",
      fecha_final: "2024-12-31",
      monto_total: "1000",
      referencia: "REF12345",
      cuenta_bancaria: {
        banco: "Banco XYZ",
        numero_cuenta: "0123456789",
        titular: "Juan Pérez",
      },
    },
    {
      cedula: "12345678",
      nombre_apellido: "Juan Pérez",
      contrato: "C-003",
      estatus: "Pendiente",
      fecha_inicio: "2024-03-01",
      fecha_final: "2024-08-30",
      monto_total: "500",
      referencia: "REF67890",
      cuenta_bancaria: {
        banco: "Banco XYZ",
        numero_cuenta: "0123456789",
        titular: "Juan Pérez",
      },
    },
    {
      cedula: "87654321",
      nombre_apellido: "María López",
      contrato: "C-002",
      estatus: "Pendiente",
      fecha_inicio: "2024-02-01",
      fecha_final: "2024-11-30",
      monto_total: "2000",
      referencia: "REF54321",
      cuenta_bancaria: {
        banco: "Banco ABC",
        numero_cuenta: "9876543210",
        titular: "María López",
      },
    },
  ];

  useEffect(() => {
    const storedContratos = JSON.parse(localStorage.getItem("contratos")) || [];
    if (storedContratos.length === 0) {
      localStorage.setItem(
        "contratos",
        JSON.stringify(datosSimuladosContratos)
      );
      setContratos(datosSimuladosContratos);
    } else {
      setContratos(storedContratos);
>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
    }
  }, []);

  const contratosAgrupados = Object.values(
    contratos.reduce((acc, c) => {
      if (!acc[c.cedula]) {
        acc[c.cedula] = [];
      }
      acc[c.cedula].push(c);
      return acc;
    }, {})
  );

  // Funciones para gestionar contratos
  const handleVerListaContratos = (cedula) => {
    const contratosDeCedula = contratos.filter((c) => c.cedula === cedula);
    setListaContratos(contratosDeCedula);
    setContratoSeleccionado(contratosDeCedula[0]);
    setMostrarModalDetalle(true);
  };

<<<<<<< HEAD
  // Función para enviar a la API
  const enviarDeposito = async (depositoData) => {
    try {
      await crearCredito(depositoData);
      Swal.fire({ icon: "success", title: "Depósito registrado" });
    } catch (err) {
      console.error("Error en crearCredito:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar depósito",
      });
    }
  };

  // Función para abrir la operación de depósito
  const handleAbrirDeposito = async (s) => {
    await handleDepositarSwal(s);
  };

=======
  const handleCerrarModal = () => {
    setMostrarModalDetalle(false);
    setContratoSeleccionado(null);
    setListaContratos([]);
  };

  const handleGestionarContrato = (contrato) => {
    setContratoSeleccionado(contrato);
  };

  const handleAbrirModalDeposito = (contrato) => {
    setContratoSeleccionado(contrato);
    setMontoDeposito("");
    setReferenciaDeposito("");
    setFechaDeposito("");
    setMostrarModalDeposito(true);
  };

  const handleCerrarModalDeposito = () => {
    setMostrarModalDeposito(false);
  };

  const handleDepositar = () => {
    if (!montoDeposito || isNaN(parseFloat(montoDeposito)) || parseFloat(montoDeposito) <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    alert(
      `Depósito de ${montoDeposito} realizado en la cuenta del contrato ${contratoSeleccionado?.contrato}`
    );
    setMontoDeposito("");
    setReferenciaDeposito("");
    setFechaDeposito("");
    setMostrarModalDeposito(false);
  };

  // Modal registro contrato
  const handleAbrirModalRegistro = () => {
    setNuevoContrato({
      cedula: "",
      nombre_apellido: "",
      contrato: "",
      estatus: "Pendiente",
      fecha_inicio: "",
      fecha_final: "",
      monto_total: "",
      referencia: "",
      cuenta_bancaria: {
        banco: "",
        numero_cuenta: "",
        titular: "",
      },
    });
    setMostrarModalRegistro(true);
  };

  const handleCerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
  };

  const handleRegistrarContrato = () => {
    if (
      !nuevoContrato.cedula ||
      !nuevoContrato.nombre_apellido ||
      !nuevoContrato.contrato ||
      !nuevoContrato.fecha_inicio ||
      !nuevoContrato.fecha_final ||
      !nuevoContrato.monto_total
    ) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }

    const contratosExistentes = JSON.parse(localStorage.getItem("contratos")) || [];
    const nuevosContratos = [...contratosExistentes, nuevoContrato];
    localStorage.setItem("contratos", JSON.stringify(nuevosContratos));
    setContratos(nuevosContratos);
    alert("Nuevo contrato registrado");
    setMostrarModalRegistro(false);
  };

>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
  return (
    <div className="flex min-h-screen bg-gray-100 font-serif">
      {menuOpen && <Menu />}
<<<<<<< HEAD
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <Header toggleMenu={() => setMenuOpen(!menuOpen)} />

        <div className="pt-20 px-8">
          {/* Mensaje de éxito */}
          {mensajeExito && (
            <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
              {mensajeExito}
            </div>
          )}

          {/* Encabezado */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
                <i className="bx bx-credit-card text-3xl text-gray-700"></i>
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">Asignacion de Contrato</h1>
            </div>
          </div>

          {/* Listado de solicitudes */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Solicitudes Aprobadas para Depositar
            </h2>
            {personasAprobadas.length === 0 ? (
              <p>No hay solicitudes aprobadas aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {solicitudesUnicas.map((s) => (
                  <div
                    key={s.cedula}
                    className="bg-white p-4 rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl relative"
                  >
                    {/* Icono */}
                    <div className="absolute top-4 right-4 text-gray-400 text-xl">
                      <i className="bx bx-user-circle"></i>
                    </div>
                    {/* Datos */}
                    <h2 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                      <i className="bx bx-user text-blue-500"></i>
                      <span>
                        {s.nombre_apellido || s.nombre_completo || s.cedula}
                      </span>
                    </h2>
                    <p className="mb-2">
                      <strong>Contrato:</strong> {s.contrato}
                    </p>
                    {/* Botones */}
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-2 hover:bg-blue-600 transition"
                        onClick={() => handleVerDetalles(s)}
                      >
                        <i className="bx bx-show"></i>
                        <span>Ver detalles</span>
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center space-x-2 hover:bg-green-600 transition"
                        onClick={() => handleAbrirDeposito(s)}
                      >
                        <i className="bx bx-dollar-circle"></i>
                        <span>Depositar</span>
                      </button>
=======
      <div className={`flex-1 flex flex-col transition-margin duration-300 ${menuOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <Header toggleMenu={toggleMenu} />

        {/* Contenido */}
        <main className="flex-1 p-8 bg-gray-100">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md hover:scale-105 transform transition duration-300 ease-in-out cursor-pointer">
                <i className="bx bx-file text-3xl text-gray-700"></i>
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">Gestión de Contratos</h1>
            </div>
          </div>

          {/* Listado de contratos gestionados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contratos gestionados</h2>
            {contratos.length === 0 ? (
              <p>No hay contratos gestionados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contratosAgrupados.map((grupo) => (
                  <div key={grupo[0].cedula} className="bg-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">{grupo[0].nombre_apellido}</h3>
                      <p>
                        <strong>Cédula:</strong> {grupo[0].cedula}
                      </p>
                      <p>
                        <strong>N° contratos:</strong> {grupo.length}
                      </p>
>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
                    </div>
                    {/* Botones */}
                    <button
                      className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => handleVerListaContratos(grupo[0].cedula)}
                    >
                      Ver contratos
                    </button>
                    <button
                      className="mt-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => {
                        setNuevoContrato({ ...nuevoContrato, cedula: grupo[0].cedula, nombre_apellido: grupo[0].nombre_apellido });
                        setMostrarModalRegistro(true);
                      }}
                    >
                      Registrar nuevo contrato
                    </button>
                    <button
                      className="mt-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => handleAbrirModalDeposito(grupo[0])}
                    >
                      Realizar Deposito
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
<<<<<<< HEAD
        </div>
=======
        </main>

        {/* Footer */}
        <footer className="mt-auto p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} IFEMI & UPTYAB. Todos los derechos reservados.
        </footer>
>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
      </div>

      {/* Modal detalles y lista de contratos */}
      {mostrarModalDetalle && (
        <div className="bg-black/50 backdrop backdrop-opacity-60 fixed inset-0 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white p-6 rounded-lg max-w-9xl w-full relative shadow-lg overflow-y-auto max-h-full">
            {/* Cerrar */}
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handleCerrarModal}>✖</button>
            {/* Contenido */}
            <h2 className="text-xl font-semibold mb-4">Contratos de {listaContratos[0]?.nombre_apellido}</h2>
            {listaContratos.length > 1 && (
              <div className="mb-4 border-b border-gray-300 pb-2">
                <h3 className="font-semibold mb-2">Selecciona un contrato para ver detalles:</h3>
                {listaContratos.map((contrato) => (
                  <button
                    key={contrato.contrato}
                    className={`block w-full text-left px-3 py-2 mb-2 rounded ${contratoSeleccionado?.contrato === contrato.contrato ? "bg-blue-100" : "hover:bg-gray-100"}`}
                    onClick={() => handleGestionarContrato(contrato)}
                  >
                    {contrato.contrato} - {contrato.estatus}
                  </button>
                ))}
              </div>
            )}
            {contratoSeleccionado && (
              <div>
                <h3 className="font-semibold mb-2">Detalles de {contratoSeleccionado.contrato}</h3>
                <p><strong>Número de contrato:</strong> {contratoSeleccionado.contrato}</p>
                <p><strong>Estatus:</strong> {contratoSeleccionado.estatus}</p>
                <p><strong>Fecha Inicio:</strong> {contratoSeleccionado.fecha_inicio}</p>
                <p><strong>Fecha Final:</strong> {contratoSeleccionado.fecha_final}</p>
                <p><strong>Monto Total:</strong> {contratoSeleccionado.monto_total}</p>
                <p><strong>Referencia:</strong> {contratoSeleccionado.referencia}</p>

                {/* Datos cuenta bancaria */}
                <h4 className="font-semibold mt-4 mb-2">Datos de la Cuenta Bancaria</h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-4">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-200">Banco</th>
                        <th className="px-4 py-2 border-b border-gray-200">Número de Cuenta</th>
                        <th className="px-4 py-2 border-b border-gray-200">Titular</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-800">
                      <tr>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.cuenta_bancaria?.banco || ""}</td>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.cuenta_bancaria?.numero_cuenta || ""}</td>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.cuenta_bancaria?.titular || ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Detalles depósito */}
                <h4 className="font-semibold mb-2">Detalles del Depósito</h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-4">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-200">Referencia</th>
                        <th className="px-4 py-2 border-b border-gray-200">Fecha</th>
                        <th className="px-4 py-2 border-b border-gray-200">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-800">
                      <tr>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.detalle_deposito?.referencia || "N/A"}</td>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.detalle_deposito?.fecha || "N/A"}</td>
                        <td className="px-4 py-2 border-b border-gray-200">{contratoSeleccionado.detalle_deposito?.medio || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para registrar nuevo contrato */}
      {mostrarModalRegistro && (
        <div className="bg-black/50 backdrop backdrop-opacity-60 fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative shadow-lg overflow-y-auto max-h-full">
            {/* Cerrar */}
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handleCerrarModalRegistro}>✖</button>
            {/* Formulario */}
            <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Contrato</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleRegistrarContrato(); }}>
              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Cedula */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="cedula">Cédula</label>
                  <input
                    id="cedula"
                    type="text"
                    placeholder="Cédula"
                    value={nuevoContrato.cedula}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, cedula: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Nombre y Apellido */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="nombre_apellido">Nombre y Apellido</label>
                  <input
                    id="nombre_apellido"
                    type="text"
                    placeholder="Nombre y Apellido"
                    value={nuevoContrato.nombre_apellido}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, nombre_apellido: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* N° Contrato (oculto) */}
                <div style={{ display: "none" }}>
                  <label className="block mb-1 font-medium" htmlFor="contrato">N° Contrato</label>
                  <input
                    id="contrato"
                    type="text"
                    placeholder="N° Contrato"
                    value={nuevoContrato.contrato}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, contrato: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Monto en Euros */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="monto_euros">Monto en Euros</label>
                  <input
                    id="monto_euros"
                    type="text"
                    placeholder="Monto en Euros"
                    value={nuevoContrato.contrato}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, contrato: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Monto en Bs.S */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="monto_bss">Monto en Bs.S</label>
                  <input
                    id="monto_bss"
                    type="text"
                    placeholder="Monto en Bs.S"
                    value={nuevoContrato.contrato}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, contrato: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Monto 5% FLAT */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="monto_total">Monto 5% FLAT</label>
                  <input
                    id="monto_total"
                    type="number"
                    placeholder="Monto Total"
                    value={nuevoContrato.monto_total}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, monto_total: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Monto 10% de Interes */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="referencia">Monto 10% de Interes</label>
                  <input
                    id="referencia"
                    type="text"
                    placeholder="Referencia"
                    value={nuevoContrato.referencia}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, referencia: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                {/* Monto a devolver */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="monto_devolver">Monto a devolver</label>
                  <input
                    id="monto_devolver"
                    type="text"
                    placeholder="Monto a devolver"
                    value={nuevoContrato.referencia}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, referencia: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                {/* Fecha Inicio */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="fecha_inicio">Fecha Inicio</label>
                  <input
                    id="fecha_inicio"
                    type="date"
                    placeholder="Fecha Inicio"
                    value={nuevoContrato.fecha_inicio}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, fecha_inicio: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                {/* Fecha Final */}
                <div>
                  <label className="block mb-1 font-medium" htmlFor="fecha_final">Fecha Final</label>
                  <input
                    id="fecha_final"
                    type="date"
                    placeholder="Fecha Final"
                    value={nuevoContrato.fecha_final}
                    onChange={(e) => setNuevoContrato({ ...nuevoContrato, fecha_final: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
              </div>
              {/* Botones */}
              <div className="flex justify-end space-x-2 mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Registrar</button>
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={handleCerrarModalRegistro}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para depósito */}
      {mostrarModalDeposito && (
        <div className="bg-black/50 backdrop backdrop-opacity-60 fixed inset-0 flex items-start justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-lg overflow-y-auto max-h-full">
            {/* Cerrar */}
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handleCerrarModalDeposito} aria-label="Cerrar">✖</button>
            {/* Título */}
            <h2 className="text-xl font-semibold mb-4">Realizar Depósito</h2>
            {/* Formulario */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const monto = parseFloat(montoDeposito);
              if (!montoDeposito || isNaN(monto) || monto <= 0) {
                alert("Ingresa un monto válido");
                return;
              }
              alert(`Depósito de ${monto} realizado en la cuenta del contrato ${contratoSeleccionado?.contrato}`);
              setReferenciaDeposito("");
              setFechaDeposito("");
              setMostrarModalDeposito(false);
            }} className="flex flex-col gap-4">
              {/* Referencia */}
              <input
                type="text"
                placeholder="Referencia"
                value={referenciaDeposito}
                onChange={(e) => setReferenciaDeposito(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
              {/* Fecha */}
              <input
                type="date"
                placeholder="Fecha"
                value={fechaDeposito}
                onChange={(e) => setFechaDeposito(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
              {/* Botón */}
              <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Depositar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default Gestion;
=======
export default gestionContratos;
>>>>>>> 26255468f7dcd8d721106b43296d3c19c5e58628
