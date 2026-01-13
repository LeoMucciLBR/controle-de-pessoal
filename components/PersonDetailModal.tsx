import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Person, AreaAtuacao } from '@/types/person';
import { StatusBadge } from './StatusBadge';
import { Mail, Phone, Building2, FileText, Calendar, Briefcase, UserCircle, Check, X, AlertCircle, Clock, CheckCircle2, Tag, Brain } from 'lucide-react';
import { areasAtuacao } from '@/lib/mock-data';
import { useSettings } from '@/contexts/SettingsContext';
import { ContractColumn } from './ContractColumn';

interface PersonDetailModalProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonDetailModal({ person, open, onOpenChange }: PersonDetailModalProps) {
  const { contratos } = useSettings();
  
  if (!person) return null;

  const getAreaLabel = (value: string) => {
    return areasAtuacao.find((a) => a.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {person.nome
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{person.nome}</h2>
              <p className="text-sm font-normal text-muted-foreground">{person.cargo}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Header Status & Resume */}
          <div className="flex flex-wrap items-center gap-4 justify-between bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <StatusBadge status={person.status} />
              
              <div className="flex flex-wrap gap-2">
                  {(person.areas || []).map(area => {
                      const areaLabel = areasAtuacao.find(a => a.value === area)?.label || area;
                      const detalhes = (person.areasDetalhes as Record<string, any>)?.[area] || []; 
                      
                      return (
                          <div key={area} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-md bg-white/5 border border-white/10">
                              <span className="text-xs font-semibold uppercase text-muted-foreground">{areaLabel}</span>
                              <div className="flex gap-1">
                                  {Array.isArray(detalhes) && detalhes.includes('PROJETO') && (
                                      <Badge variant="outline" className="text-[9px] h-5 px-1.5 bg-blue-500/10 text-blue-400 border-blue-500/20">Proj</Badge>
                                  )}
                                  {Array.isArray(detalhes) && detalhes.includes('OBRA') && (
                                      <Badge variant="outline" className="text-[9px] h-5 px-1.5 bg-orange-500/10 text-orange-400 border-orange-500/20">Obra</Badge>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>

              {person.formacao && <span className="text-sm font-medium text-muted-foreground ml-2">{person.formacao}</span>}
            </div>
            {person.curriculo && (
                <Badge className="bg-blue-600 hover:bg-blue-700">Currículo Disponível</Badge>
            )}
          </div>

          <Separator />

          {/* Dados Pessoais e Contato */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
               <UserCircle className="h-5 w-5 text-primary" /> Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <InfoItem label="CPF" value={person.cpf} />
               <InfoItem label="RG" value={person.rg} />
               <InfoItem label="Data de Nascimento" value={person.dataNascimento ? new Date(person.dataNascimento).toLocaleDateString('pt-BR') : '-'} />
               
               <InfoItem label="Email" value={person.email} isLink href={`mailto:${person.email}`} icon={<Mail className="h-3 w-3" />} className="md:col-span-2" />
               <InfoItem label="Telefone" value={person.telefone} isLink href={`tel:${person.telefone}`} icon={<Phone className="h-3 w-3" />} />
               
               <InfoItem label="Endereço" value={person.endereco} className="md:col-span-3" />
            </div>
          </section>

          <Separator />

          {/* Dados Corporativos */}
          {/* Dados Corporativos */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
               <Building2 className="h-5 w-5 text-primary" /> Dados da Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <InfoItem label="Empresa" value={person.empresa} />
               <InfoItem label="Contrato Global" value={person.contrato} />
               <InfoItem label="Admissão" value={person.dataAdmissao ? new Date(person.dataAdmissao).toLocaleDateString('pt-BR') : '-'} />
               <InfoItem label="Cargo" value={person.cargo} />
               
               <InfoItem label="Vigência Início" value={person.vigenciaInicio ? new Date(person.vigenciaInicio).toLocaleDateString('pt-BR') : '-'} />
               <InfoItem label="Vigência Fim" value={person.vigenciaFim ? new Date(person.vigenciaFim).toLocaleDateString('pt-BR') : '-'} />
               
               <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Status Vigência</span>
                  {(() => {
                        const dbStatus = person.vigenciaStatus?.toLowerCase();
                        if (dbStatus === 'vencido') {
                             return <Badge variant="destructive" className="w-fit flex gap-1 items-center px-2 py-0.5 text-xs"><AlertCircle className="w-3 h-3" /> Vencido</Badge>;
                        }
                        return <Badge variant="outline" className="w-fit border-emerald-500/30 text-emerald-500 bg-emerald-500/5 flex gap-1 items-center px-2 py-0.5 text-xs"><CheckCircle2 className="w-3 h-3" /> {person.vigenciaStatus || 'Vigente'}</Badge>;
                  })()}
               </div>
               
               <div className="col-span-full mt-2">
                  <Separator className="mb-4" />
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Contratos Detalhados
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x custom-scrollbar">
                      {(() => {
                        // Fallback logic specific for display:
                        // If contratosAtivos is present, use it.
                        // If not, infer from contratosDetalhados presence.
                        let activeTypes = person.contratosAtivos || [];
                        if (activeTypes.length === 0 && person.contratosDetalhados && person.contratosDetalhados.length > 0) {
                             activeTypes = Array.from(new Set(person.contratosDetalhados.map(c => c.tipo)));
                        }

                        // If still empty (no active and no detailed), maybe show nothing or message?
                        // Showing nothing as per user request ("so deve aparecer os ativos")
                        
                        return contratos
                            .filter(tipo => activeTypes.includes(tipo))
                            .map((tipo) => (
                              <div key={tipo} className="snap-start shrink-0">
                                  <ContractColumn 
                                      type={tipo}
                                      contracts={(person.contratosDetalhados || []).filter(c => c.tipo === tipo)}
                                      readOnly
                                      color="bg-purple-500"
                                  />
                              </div>
                          ));
                      })()}
                  </div>
               </div>
            </div>
          </section>

          <Separator />
          
          {/* Documentação */}
          <section>
             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
               <FileText className="h-5 w-5 text-primary" /> Documentação & Jurídico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
               <InfoBoolean label="Termo de Confidencialidade" value={person.termoConfidencialidade} />
               <InfoBoolean label="Apresentou CNPJ/Contrato Social" value={person.apresentouCartaoCnpj} />
               <InfoItem label="Nº CNPJ" value={person.numeroCnpj} />
               
               <div className="col-span-full border-t border-dashed my-2" />
               
               <InfoItem label="Conselho de Classe" value={person.conselhoClasse} />
               <InfoItem label="Nº Registro Conselho" value={person.numeroRegistroConselho} />
               <InfoItem label="Ano Registro" value={person.anoRegistroConselho?.toString()} />
               <InfoBoolean label="Certidão Quitação PF" value={person.certidaoQuitacaoPf} />
               <InfoBoolean label="Certidão Quitação PJ" value={person.certidaoQuitacaoPj} />
               
               {(person.certidaoQuitacaoPf || person.certidaoQuitacaoPj) && (
                <div className="col-span-full mt-2 p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
                    <p className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                       <FileText className="w-3 h-3" /> Detalhes Certidão
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">Data de Emissão</span>
                            <span className="text-sm font-medium">
                                {person.certidaoQuitacaoData ? new Date(person.certidaoQuitacaoData).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                            </span>
                        </div>
                         <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">Status</span>
                            {person.certidaoQuitacaoStatus === 'vigente' && (
                                 <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">Vigente</Badge>
                            )}
                            {person.certidaoQuitacaoStatus === 'vencido' && (
                                 <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50">Vencido</Badge>
                            )}
                            {(person.certidaoQuitacaoStatus === 'na' || (!person.certidaoQuitacaoStatus && person.certidaoQuitacaoStatus !== 'vigente' && person.certidaoQuitacaoStatus !== 'vencido')) && (
                                 <span className="text-sm text-muted-foreground uppercase">{person.certidaoQuitacaoStatus === 'na' ? 'Não Aplicável' : '-'}</span>
                            )}
                        </div>
                    </div>
                </div>
               )}
            </div>
          </section>

          <Separator />

          {/* Histórico e Competências */}
          <section>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold mb-3">Histórico Profissional</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-md border min-h-[80px]">
                        {person.historicoProfissional || "Sem histórico registrado."}
                    </p>
                </div>
                <div className="space-y-6">
                    <div>
                         <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Competências</h3>
                         <div className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-md border min-h-[80px] content-start">
                            {person.competencias && person.competencias.length > 0 ? (
                                person.competencias.map(c => (
                                    <Badge key={c} variant="secondary" className="bg-white/10 hover:bg-white/20">
                                        <Tag className="w-3 h-3 mr-1 opacity-50" /> {c}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">Nenhuma competência registrada.</span>
                            )}
                         </div>
                    </div>
                    <div>
                         <h3 className="text-sm font-semibold mb-3">Treinamentos</h3>
                         <ul className="list-disc list-inside text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border min-h-[80px]">
                            {person.treinamentos?.map(t => <li key={t}>{t}</li>) || <li>Nenhum treinamento registrado.</li>}
                         </ul>
                    </div>
                </div>
             </div>
          </section>

          <Separator />

           {/* Áreas e Disciplinas */}
           <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-primary" /> Atuação Técnica
            </h3>
            
            <div className="space-y-4">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Áreas de Atuação</p>
                    <div className="flex flex-wrap gap-2">
                    {person.areas.map((area) => (
                        <Badge key={area} className="bg-primary/20 text-white hover:bg-primary/30 border-transparent">
                        {getAreaLabel(area)}
                        </Badge>
                    ))}
                    </div>
                </div>

                {person.disciplinasProjeto && person.disciplinasProjeto.length > 0 && (
                     <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Disciplinas de Projeto</p>
                        <div className="flex flex-wrap gap-2">
                            {person.disciplinasProjeto.map(d => <Badge key={d} variant="outline">{d}</Badge>)}
                        </div>
                     </div>
                )}

                {person.disciplinasObra && person.disciplinasObra.length > 0 && (
                     <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Disciplinas de Obra</p>
                        <div className="flex flex-wrap gap-2">
                            {person.disciplinasObra.map(d => <Badge key={d} variant="outline">{d}</Badge>)}
                        </div>
                     </div>
                )}
            </div>
          </section>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value, isLink, href, icon, className }: { label: string, value?: string, isLink?: boolean, href?: string, icon?: React.ReactNode, className?: string }) {
    return (
        <div className={className}>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            {isLink && href ? (
                <a href={href} className="text-sm font-medium hover:text-primary flex items-center gap-1.5 transition-colors">
                    {icon} {value || '-'}
                </a>
            ) : (
                <p className="text-sm font-medium text-foreground">{value || '-'}</p>
            )}
        </div>
    )
}

function InfoBoolean({ label, value }: { label: string, value?: boolean }) {
    return (
        <div className="flex items-center justify-between bg-muted/20 p-2 rounded border border-transparent hover:border-border transition-colors">
            <span className="text-sm text-muted-foreground">{label}</span>
            {value ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
        </div>
    )
}
