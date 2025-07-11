import { useForm, type SubmitHandler } from "react-hook-form";
import { FormField } from "../../components/FormField";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useNavigate, useParams } from "react-router";
import { URLS } from "../../navigation/CONTANTS";
import { useEffect, useState, useMemo } from "react";
import { VotanteService, type Recinto } from "../../services/PadronElectoral/VotanteService";
import { Container } from "../../components/Container";
import { MenuPadron } from "../../components/MenuPadron";

type Inputs = {
  ci: string;
  nombre_completo: string;
  direccion: string;
  recinto_id: number;
  foto_ci_anverso: FileList;
  foto_ci_reverso: FileList;
  foto_votante: FileList;
};

interface Votante {
  ci: string;
  nombre_completo: string;
  direccion: string;
  recinto_id: number;
  foto_ci_anverso?: string;
  foto_ci_reverso?: string;
  foto_votante?: string;
}

export const VotanteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const votanteService = useMemo(() => new VotanteService(), []);

  const [previewAnverso, setPreviewAnverso] = useState<string | null>(null);
  const [previewReverso, setPreviewReverso] = useState<string | null>(null);
  const [previewVotante, setPreviewVotante] = useState<string | null>(null);
  const [recintos, setRecintos] = useState<Recinto[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched",
  });

  const fotoAnverso = watch("foto_ci_anverso");
  const fotoReverso = watch("foto_ci_reverso");
  const fotoVotante = watch("foto_votante");

  useEffect(() => {
    votanteService.getRecintos().then(setRecintos).catch(console.error);
  }, [votanteService]);

  useEffect(() => {
    if (isEdit) {
      votanteService.getVotanteById(Number(id!)).then((votante: Votante) => {
        reset({
          ci: votante.ci,
          nombre_completo: votante.nombre_completo,
          direccion: votante.direccion,
          recinto_id: votante.recinto_id,
        });
        setPreviewAnverso(votante.foto_ci_anverso || null);
        setPreviewReverso(votante.foto_ci_reverso || null);
        setPreviewVotante(votante.foto_votante || null);
      });
    }
  }, [id, isEdit, reset, votanteService]);

  useEffect(() => {
    if (fotoAnverso?.[0]) setPreviewAnverso(URL.createObjectURL(fotoAnverso[0]));
  }, [fotoAnverso]);

  useEffect(() => {
    if (fotoReverso?.[0]) setPreviewReverso(URL.createObjectURL(fotoReverso[0]));
  }, [fotoReverso]);

  useEffect(() => {
    if (fotoVotante?.[0]) setPreviewVotante(URL.createObjectURL(fotoVotante[0]));
  }, [fotoVotante]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("ci", data.ci);
      formData.append("nombre_completo", data.nombre_completo);
      formData.append("direccion", data.direccion);
      formData.append("recinto_id", data.recinto_id.toString());

      const recinto = recintos.find(r => r.id === data.recinto_id);
      formData.append("recinto_nombre", recinto?.nombre || "");

      if (data.foto_ci_anverso?.[0]) formData.append("foto_ci_anverso", data.foto_ci_anverso[0]);
      if (data.foto_ci_reverso?.[0]) formData.append("foto_ci_reverso", data.foto_ci_reverso[0]);
      if (data.foto_votante?.[0]) formData.append("foto_votante", data.foto_votante[0]);

      if (isEdit) {
        await votanteService.updateVotante(Number(id), formData);
      } else {
        if (!data.foto_ci_anverso?.length || !data.foto_ci_reverso?.length || !data.foto_votante?.length) {
          alert("Debe subir todas las fotos obligatorias");
          return;
        }
        await votanteService.createVotante(formData);
      }

      navigate(URLS.VOTANTES.LIST);
    } catch (error) {
      console.error("Error al guardar votante:", error);
      alert("Error al guardar votante, revisa la consola.");
    }
  };

  return (
    <>
          <MenuPadron />
          <Container>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card title={isEdit ? "Editar Votante" : "Registrar Votante"} className="w-full max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <label htmlFor="ci">CI</label>
            <input
              id="ci"
              {...register("ci", { required: "El CI es obligatorio" })}
              placeholder="Número de CI"
              className="border rounded w-full p-2"
            />
            {errors.ci && <p className="text-red-600 text-sm">{errors.ci.message}</p>}
          </FormField>

          <FormField>
            <label htmlFor="nombre_completo">Nombre completo</label>
            <input
              id="nombre_completo"
              {...register("nombre_completo", { required: "El nombre completo es obligatorio" })}
              placeholder="Nombre completo"
              className="border rounded w-full p-2"
            />
            {errors.nombre_completo && <p className="text-red-600 text-sm">{errors.nombre_completo.message}</p>}
          </FormField>

          <FormField>
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              {...register("direccion", { required: "La dirección es obligatoria" })}
              placeholder="Dirección"
              className="border rounded w-full p-2"
            />
            {errors.direccion && <p className="text-red-600 text-sm">{errors.direccion.message}</p>}
          </FormField>

          <FormField>
            <label htmlFor="recinto_id">Recinto</label>
            <select
              id="recinto_id"
              {...register("recinto_id", { required: "El recinto es obligatorio", valueAsNumber: true })}
              className="border rounded w-full p-2"
            >
              <option value="">Seleccione un recinto</option>
              {recintos.map(rec => (
                <option key={rec.id} value={rec.id}>
                  {rec.nombre}
                </option>
              ))}
            </select>
            {errors.recinto_id && <p className="text-red-600 text-sm">{errors.recinto_id.message}</p>}
          </FormField>

          <FormField>
            <label htmlFor="foto_ci_anverso">Foto CI Anverso</label>
            <input
              type="file"
              accept="image/*"
              {...register("foto_ci_anverso", { required: !isEdit })}
              className="w-full"
            />
            {errors.foto_ci_anverso && <p className="text-red-600 text-sm">{errors.foto_ci_anverso.message}</p>}
            {previewAnverso && <img src={previewAnverso} alt="CI Anverso" className="mt-2 max-h-40 rounded border" />}
          </FormField>

          <FormField>
            <label htmlFor="foto_ci_reverso">Foto CI Reverso</label>
            <input
              type="file"
              accept="image/*"
              {...register("foto_ci_reverso", { required: !isEdit })}
              className="w-full"
            />
            {errors.foto_ci_reverso && <p className="text-red-600 text-sm">{errors.foto_ci_reverso.message}</p>}
            {previewReverso && <img src={previewReverso} alt="CI Reverso" className="mt-2 max-h-40 rounded border" />}
          </FormField>

          <FormField>
            <label htmlFor="foto_votante">Foto Votante</label>
            <input
              type="file"
              accept="image/*"
              {...register("foto_votante", { required: !isEdit })}
              className="w-full"
            />
            {errors.foto_votante && <p className="text-red-600 text-sm">{errors.foto_votante.message}</p>}
            {previewVotante && <img src={previewVotante} alt="Foto Votante" className="mt-2 max-h-40 rounded border" />}
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" title="Guardar" />
          </div>
        </form>
        
      </Card>
      
    </div>
      </Container>
      </>
  );
};
